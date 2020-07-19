package com.project.ftp.service;

import com.project.ftp.common.SysUtils;
import com.project.ftp.config.AppConfig;
import com.project.ftp.config.AppConstant;
import com.project.ftp.exceptions.AppException;
import com.project.ftp.exceptions.ErrorCodes;
import com.project.ftp.obj.LoginUserDetails;
import com.project.ftp.session.SessionData;
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
    final static Long sessionTime = (long) (60 * 1000);//10 min = 10*60*1000
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
            throw new AppException(ErrorCodes.RUNTIME_ERROR);
        }
        return currentSessionData;
    }
    private String getSessionId(HttpServletRequest request) {
        HttpSession httpSession = request.getSession();
        return (String) httpSession.getAttribute(AppConstant.SESSION_COOKIE_DATA);
    }
    private static SessionData getNewSession(String sessionId) {
        SysUtils sysUtils = new SysUtils();
        Long currentTime = sysUtils.getTimeInMsLong();
        return new SessionData(sessionId, currentTime);
    }
    public static String updateSessionId(AppConfig appConfig1, String currentSessionId) {
        SysUtils sysUtils = new SysUtils();
        HashMap<String, SessionData> sessionDataHashMap = appConfig1.getSessionData();
        String sessionId;
        SessionData sessionData;
        ArrayList<String> deletedSessionIds = new ArrayList<>();
        Long currentTime = sysUtils.getTimeInMsLong();
        if (sessionDataHashMap != null) {
            for (Map.Entry<String, SessionData> sessionDataMap: sessionDataHashMap.entrySet()) {
                sessionId = sessionDataMap.getKey();
                sessionData = sessionDataMap.getValue();
                if (currentTime - sessionData.getUpdatedTime() >= sessionTime) {
                    deletedSessionIds.add(sessionId);
                }
                if (currentSessionId.equals(sessionId)) {
                    sessionData.setUpdatedTime(sysUtils.getTimeInMsLong());
                }
            }
            if (sessionDataHashMap.get(currentSessionId) == null) {
                sessionDataHashMap.put(currentSessionId, getNewSession(currentSessionId));
            }
        } else {
            sessionDataHashMap = new HashMap<>();
            sessionDataHashMap.put(currentSessionId, getNewSession(currentSessionId));
        }
        String newSessionId = UUID.randomUUID().toString();
        for (String str: deletedSessionIds) {
            logger.info("Deleted session data, at: {}, is: {}", currentTime, sessionDataHashMap.get(str));
            sessionDataHashMap.remove(str);
            if (str.equals(currentSessionId)) {
                logger.info("currentSessionId: {}, is expired, created new: {}", currentSessionId, newSessionId);
                sessionDataHashMap.put(newSessionId, getNewSession(newSessionId));
                currentSessionId = newSessionId;
            }
        }
        appConfig1.setSessionData(sessionDataHashMap);
        return currentSessionId;
    }
    public void loginUser(HttpServletRequest request, String username) throws AppException {
        HashMap<String, SessionData> sessionData = appConfig.getSessionData();
        SessionData currentSessionData = sessionData.get(this.getSessionId(request));
        if (currentSessionData != null) {
            currentSessionData.setUsername(username);
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
//    public Boolean isLogin(HttpServletRequest request) {
//        String loginUserName = getLoginUserName(request);
//        return loginUserName != null && !loginUserName.isEmpty();
//    }
//    public String getLoginUserName(HttpServletRequest request) {
//        SessionData sessionData = null;
//        String username;
//        try {
//            sessionData = SessionService.getCurrentSessionData(appConfig, request);
//            username = sessionData.getUsername();
//        } catch (AppException ae) {
//            username = "";
//        }
//        if (username == null) {
//            username = "";
//        }
//        return username;
//    }
    public LoginUserDetails getLoginUserDetails(HttpServletRequest request) {
        LoginUserDetails loginUserDetails = new LoginUserDetails();
        try {
            SessionData sessionData = getCurrentSessionData(appConfig, request);
            String loginUserName = sessionData.getUsername();
            if (loginUserName == null) {
                loginUserName = "";
            }
            loginUserDetails.setUsername(loginUserName);
            loginUserDetails.setLogin(!loginUserName.isEmpty());

            ArrayList<String> adminUserNames = appConfig.getFtpConfiguration().getAdminUsersName();
            if (adminUserNames != null && !loginUserName.isEmpty()) {
                loginUserDetails.setLoginUserAdmin(adminUserNames.contains(loginUserName));
            }

            ArrayList<String> devUserNames = appConfig.getFtpConfiguration().getDevUsersName();
            if (devUserNames != null && !loginUserName.isEmpty()) {
                loginUserDetails.setLoginUserDev(devUserNames.contains(loginUserName));
            }
        } catch (Exception e) {
            logger.info("Error in getting loginUserDetails: {}", e.getMessage());
        }
        return loginUserDetails;
    }

}
