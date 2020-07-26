package com.project.ftp.session;

import com.project.ftp.common.SysUtils;
import com.project.ftp.config.AppConfig;
import com.project.ftp.config.AppConstant;
import com.project.ftp.exceptions.AppException;
import com.project.ftp.exceptions.ErrorCodes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class SessionService {
    final static Logger logger = LoggerFactory.getLogger(SessionService.class);
    final AppConfig appConfig;
    final SysUtils sysUtils = new SysUtils();
    public SessionService(final AppConfig appConfig) {
        this.appConfig = appConfig;
    }
    private SessionData getCurrentSessionData(AppConfig appConfig,
                                                    HttpServletRequest request) throws AppException {
        String sessionId = getSessionId(request);
        HashMap<String, SessionData> sessionData = appConfig.getSessionData();
        SessionData currentSessionData = sessionData.get(sessionId);
        if (currentSessionData == null) {
            logger.info("CurrentSessionId: {}, not found in: {}", sessionId, appConfig.getSessionData());
            throw new AppException(ErrorCodes.INVALID_SESSION);
        }
        return currentSessionData;
    }
    private String getSessionId(HttpServletRequest request) {
        HttpSession httpSession = request.getSession();
        return (String) httpSession.getAttribute(AppConstant.SESSION_COOKIE_DATA);
    }
    private SessionData getNewSession(String sessionId) {
        Long currentTime = sysUtils.getTimeInMsLong();
        return new SessionData(sessionId, currentTime);
    }
    public String updateSessionId(String currentSessionId) {
        String newSessionId = UUID.randomUUID().toString();
        if (currentSessionId.length() > 40 || currentSessionId.length() < 30) {
            logger.info("Invalid currentSessionId length(30 to 40): {}, created new: {}", currentSessionId, newSessionId);
            currentSessionId = newSessionId;
        }
        HashMap<String, SessionData> sessionDataHashMap = appConfig.getSessionData();
        String sessionId;
        SessionData sessionData;
        ArrayList<String> deletedSessionIds = new ArrayList<>();
        Long currentTime = sysUtils.getTimeInMsLong();
        if (sessionDataHashMap != null) {
            for (Map.Entry<String, SessionData> sessionDataMap: sessionDataHashMap.entrySet()) {
                sessionId = sessionDataMap.getKey();
                sessionData = sessionDataMap.getValue();
                if (currentTime - sessionData.getUpdatedTime() >= AppConstant.SESSION_TTL) {
                    deletedSessionIds.add(sessionId);
                }
                if (currentSessionId.equals(sessionId)) {
                    sessionData.setUpdatedTime(sysUtils.getTimeInMsLong());
                }
            }
            if (sessionDataHashMap.get(currentSessionId) == null) {
                sessionDataHashMap.put(currentSessionId, this.getNewSession(currentSessionId));
            }
        } else {
            logger.info("sessionDataHashMap is null, create new.");
            sessionDataHashMap = new HashMap<>();
            sessionDataHashMap.put(currentSessionId, this.getNewSession(currentSessionId));
        }
        for (String str: deletedSessionIds) {
            logger.info("Deleted expired session data, at: {}, is: {}", currentTime, sessionDataHashMap.get(str));
            sessionDataHashMap.remove(str);
            if (str.equals(currentSessionId)) {
                logger.info("currentSessionId: {}, is expired, create new: {}", currentSessionId, newSessionId);
                sessionDataHashMap.put(newSessionId, this.getNewSession(newSessionId));
                currentSessionId = newSessionId;
            }
        }
        appConfig.setSessionData(sessionDataHashMap);
        return currentSessionId;
    }
    public void loginUser(HttpServletRequest request, String username) throws AppException {
        HashMap<String, SessionData> sessionData = appConfig.getSessionData();
        String sessionId = this.getSessionId(request);
        SessionData currentSessionData = sessionData.get(sessionId);
        if (currentSessionData != null) {
            if (username == null || username.isEmpty()) {
                logger.info("userLogin request username is incorrect: {}", username);
                throw new AppException(ErrorCodes.BAD_REQUEST_ERROR);
            }
            currentSessionData.setUsername(username);
        } else {
            logger.info("Current session not found, sessionId: {}", sessionId);
            throw new AppException(ErrorCodes.INVALID_SESSION);
        }
    }
    public void logoutUser(HttpServletRequest request) {
        HashMap<String, SessionData> sessionData = appConfig.getSessionData();
        String sessionId = this.getSessionId(request);
        SessionData currentSessionData = sessionData.get(sessionId);
        if (currentSessionData != null) {
            sessionData.remove(sessionId);
        }
    }
    public String getLoginUserName(HttpServletRequest request) {
        String loginUserName = null;
        try {
            SessionData sessionData = this.getCurrentSessionData(appConfig, request);
            loginUserName = sessionData.getUsername();
            if (loginUserName == null || loginUserName.isEmpty()) {
                loginUserName = null;
            }
        } catch (Exception e) {
            logger.info("Error in getting loginUserDetails: {}", e.getMessage());
        }
        // Data mocking from tempConfig
        /*
        if (loginUserName == null) {
            HashMap<String, String> tempConfig = appConfig.getFtpConfiguration().getTempConfig();
            if (tempConfig != null) {
                loginUserName = tempConfig.get("username");
                if (loginUserName == null || loginUserName.isEmpty()) {
                    loginUserName = null;
                }
            }
        }
        */
        return loginUserName;
    }
}
