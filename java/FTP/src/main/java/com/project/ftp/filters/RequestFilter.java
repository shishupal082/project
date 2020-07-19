package com.project.ftp.filters;

import com.project.ftp.config.AppConfig;
import com.project.ftp.config.AppConstant;
import com.project.ftp.exceptions.AppException;
import com.project.ftp.exceptions.ErrorCodes;
import com.project.ftp.service.FileServiceV2;
import com.project.ftp.service.SessionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.Priority;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Context;
import java.util.ArrayList;
import java.util.UUID;

/**
 * Created by shishupalkumar on 11/02/17.
 */
@Priority(501)
public class RequestFilter implements ContainerRequestFilter {
    final static Logger logger = LoggerFactory.getLogger(RequestFilter.class);
    @Context
    private HttpServletRequest httpServletRequest;
    final AppConfig appConfig;
    public RequestFilter(final AppConfig appConfig) {
        this.appConfig = appConfig;
    }
    private String getCookieData() {
        String cookieName = AppConstant.COOKIE_NAME;
        Cookie[] cookies = httpServletRequest.getCookies();
        if (cookies == null){
            logger.info("Unable to get cookieData for cookieName : {}", cookieName);
            return null;
        }
        String cookieData = null;
        for (Cookie cookie : cookies) {
            if (cookie.getName().equalsIgnoreCase(cookieName)) {
                cookieData = cookie.getValue();
                break;
            }
        }
        return cookieData;
    }
    public void filter(final ContainerRequestContext requestContext) throws AppException {
        String cookieData = getCookieData();
        String newCookieData = null;
        HttpSession httpSession = httpServletRequest.getSession();
        String origin = requestContext.getHeaderString(AppConstant.ORIGIN);
        if (origin != null) {
            ArrayList<String> allowedOrigin = appConfig.getFtpConfiguration().getAllowedOrigin();
            if (allowedOrigin != null) {
                if (!allowedOrigin.contains(origin)) {
                    logger.info("UnAuthorized Origin: {}, AllowedOrigin: {}", origin, allowedOrigin);
                    throw new AppException(ErrorCodes.UNAUTHORIZED_ORIGIN);
                }
            } else {
                logger.info("allowedOrigin not defined in FtpConfiguration: {}", origin);
                throw new AppException(ErrorCodes.CONFIG_ERROR);
            }
        }
        if (cookieData == null || cookieData.equals("")) {
            newCookieData = UUID.randomUUID().toString();
            logger.info("Invalid session cookieData : {}, Created new : {}", cookieData, newCookieData);
            cookieData = newCookieData;
        }
        cookieData = SessionService.updateSessionId(appConfig, cookieData);
        LogFilter.addSessionIdInLog(cookieData);
        httpSession.setAttribute(AppConstant.SESSION_COOKIE_DATA, cookieData);
        String requestedPath = FileServiceV2.getPathUrlV2(requestContext);
        if (!AppConstant.FAVICON_ICO_PATH.equals(requestedPath)) {
            logger.info("RequestFilter executed, cookieData : {}", cookieData);
        }
    }
}
