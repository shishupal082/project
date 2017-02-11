package com.todo.filters;

/**
 * Created by shishupalkumar on 12/01/17.
 */

import com.todo.constants.AppConstant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

import java.io.IOException;
import java.util.UUID;

import javax.annotation.Priority;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Context;
import javax.ws.rs.ext.Provider;


@Priority(500) // Highest priority filter
@Provider
public class LogFilter implements ContainerRequestFilter {
    private static Logger logger = LoggerFactory.getLogger(LogFilter.class);
    @Context
    private HttpServletRequest httpServletReq;

    public void filter(ContainerRequestContext requestContext) throws IOException {
        String requestId = String.valueOf(UUID.randomUUID());
        logger.info("Logger requestId generated : {}", requestId);
        MDC.remove(AppConstant.X_REQUEST_Id);
        MDC.put(AppConstant.X_REQUEST_Id, requestId);
    }
}

