package com.project.ftp.filters;

import com.project.ftp.config.AppConstant;
import com.project.ftp.service.StaticService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.Priority;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.core.Context;
import java.io.IOException;

/**
 * Created by shishupalkumar on 11/02/17.
 */
@Priority(1001)
public class ResponseFilter implements ContainerResponseFilter {

    final static Logger logger = LoggerFactory.getLogger(ResponseFilter.class);
    @Context
    private HttpServletRequest httpServletRequest;
    @Context
    private HttpServletResponse httpServletResponse;
    public void filter(ContainerRequestContext requestContext,
                       ContainerResponseContext responseContext) throws IOException {
        HttpSession httpSession = httpServletRequest.getSession();
        String  responseCookieData = (String) httpSession.getAttribute(AppConstant.SESSION_COOKIE_DATA);
        Cookie sessionCookie = new Cookie(AppConstant.COOKIE_NAME, responseCookieData);
        sessionCookie.setPath("/");
        httpServletResponse.addCookie(sessionCookie);
        String origin = requestContext.getHeaderString(AppConstant.ORIGIN);
        if (origin != null) {
            responseContext.getHeaders().add(AppConstant.ALLOWED_ACCESS, origin);
            //Required for json in and out post request (only for cross origin)
            responseContext.getHeaders().add(AppConstant.ALLOWED_HEADERS, "Content-Type, Accept");
//            responseContext.getHeaders().add("Access-Control-Allow-Credentials", true);
//            responseContext.getHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        }
        String requestedPath = StaticService.getPathUrlV2(requestContext);
        if (!AppConstant.FAVICON_ICO_PATH.equals(requestedPath)) {
            logger.info("ResponseFilter executed sessionCookie : {}",
                    sessionCookie.getValue());
        }
    }
}
