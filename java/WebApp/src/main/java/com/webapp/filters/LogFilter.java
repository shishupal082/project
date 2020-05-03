package com.webapp.filters;

/**
 * Created by shishupalkumar on 12/01/17.
 */

import com.webapp.constants.AppConstant;
import com.webapp.service.FileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

import javax.annotation.Priority;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Context;
import javax.ws.rs.ext.Provider;
import java.io.IOException;
import java.util.UUID;


@Priority(500) // Highest priority filter
@Provider
public class LogFilter implements ContainerRequestFilter {
    private static Logger LOGGER = LoggerFactory.getLogger(LogFilter.class);
    @Context
    private HttpServletRequest httpServletReq;

    public void filter(ContainerRequestContext requestContext) throws IOException {
        String requestId = String.valueOf(UUID.randomUUID());
        String requestedPath = FileService.getPathUrlV2(requestContext);
        if (!AppConstant.FAVICON_ICO_PATH.equals(requestedPath)) {
            LOGGER.info("Logger requestId generated : {}", requestId);
        }
        MDC.remove(AppConstant.X_REQUEST_ID);
        MDC.put(AppConstant.X_REQUEST_ID, requestId);
    }
    public static void addSessionIdInLog(String sessionId)  {
        MDC.remove(AppConstant.X_SESSION_ID);
        MDC.put(AppConstant.X_SESSION_ID, sessionId);
    }
}

