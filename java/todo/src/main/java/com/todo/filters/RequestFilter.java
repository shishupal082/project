package com.todo.filters;

import com.todo.constants.AppConstant;
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
import java.util.UUID;

/**
 * Created by shishupalkumar on 11/02/17.
 */
@Priority(501)
public class RequestFilter implements ContainerRequestFilter {
    private static Logger logger = LoggerFactory.getLogger(RequestFilter.class);
    @Context
    private HttpServletRequest httpServletRequest;
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
    public void filter(final ContainerRequestContext requestContext) throws IOException {
        String cookieData = getCookieData(AppConstant.COOKIE_NAME);
        HttpSession httpSession = null;
        try {
//            httpSession = httpServletRequest.getSession();
//            httpSession.setAttribute("requestFilterIdentifier", UUID.randomUUID());
//            logger.info("httpSession : {}", httpSession);
        } catch (Exception e) {
            logger.info("Error in accessing httpSession : {}", e);
        }
        logger.info("RequestFilter executed, cookieData : {}, httpSession : {}", cookieData, httpSession);
    }
}
