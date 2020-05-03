package com.webapp.filters;

import com.webapp.config.WebAppConfig;
import com.webapp.constants.AppConstant;
import com.webapp.exceptions.ErrorCodes;
import com.webapp.exceptions.WebAppException;
import com.webapp.service.FileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.Priority;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Context;
import java.io.IOException;
import java.util.ArrayList;
import java.util.UUID;

/**
 * Created by shishupalkumar on 11/02/17.
 */
@Priority(501)
public class RequestFilter implements ContainerRequestFilter {
    private static Logger logger = LoggerFactory.getLogger(RequestFilter.class);
    @Context
    private HttpServletRequest httpServletRequest;
    private WebAppConfig webAppConfig;
    public RequestFilter(final WebAppConfig webAppConfig) {
        this.webAppConfig = webAppConfig;
    }
    private String getCookieData(String cookieName) {
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
    public void filter(final ContainerRequestContext requestContext) throws WebAppException {
        String cookieData = getCookieData(AppConstant.COOKIE_NAME);
        String newCookieData = null;
        HttpSession httpSession = httpServletRequest.getSession();
        String origin = requestContext.getHeaderString(AppConstant.ORIGIN);
        if (origin != null) {
            ArrayList<String> allowedOrigin = webAppConfig.getWebAppConfiguration().getAllowedOrigin();
            if (allowedOrigin != null) {
                if (!allowedOrigin.contains(origin)) {
                    logger.info("UnAuthorized Origin: {}, AllowedOrigin: {}", origin, allowedOrigin);
                    throw new WebAppException(ErrorCodes.UNAUTHORIZED_ORIGIN);
                }
            }
        }
        if (cookieData == null || cookieData.equals("")) {
            newCookieData = UUID.randomUUID().toString();
            logger.info("Invalid session cookieData : {}, Created new : {}", cookieData, newCookieData);
            cookieData = newCookieData;
        }
        LogFilter.addSessionIdInLog(cookieData);
        httpSession.setAttribute(AppConstant.SESSION_COOKIE_DATA, cookieData);
        String requestedPath = FileService.getPathUrlV2(requestContext);
        if (!AppConstant.FAVICON_ICO_PATH.equals(requestedPath)) {
            logger.info("RequestFilter executed, cookieData : {}", cookieData);
        }
    }
}
