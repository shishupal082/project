package com.todo.filters;

import com.todo.constants.AppConstant;
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
import java.util.UUID;

/**
 * Created by shishupalkumar on 11/02/17.
 */
@Priority(1001)
public class ResponseFilter implements ContainerResponseFilter {

    private static Logger logger = LoggerFactory.getLogger(ResponseFilter.class);
    @Context
    private HttpServletRequest httpServletRequest;
    @Context
    private HttpServletResponse httpServletResponse;
    public void filter(ContainerRequestContext requestContext,
                       ContainerResponseContext responseContext) throws IOException {
        HttpSession httpSession = null;
        Cookie sessionCookie = new Cookie(AppConstant.COOKIE_NAME, String.valueOf(UUID.randomUUID()));
        sessionCookie.setPath("/");
        httpServletResponse.addCookie(sessionCookie);
//        httpSession = httpServletRequest.getSession();
        logger.info("ResponseFilter executed sessionCookie : {}, httpSession : {}",
            sessionCookie.getValue(), httpSession);
    }
}