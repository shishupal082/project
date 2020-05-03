package com.webapp.exceptions;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;
import java.util.concurrent.TimeoutException;

@Provider
public class WebAppExceptionMapper implements ExceptionMapper<Exception> {
    private static Logger logger = LoggerFactory.getLogger(WebAppExceptionMapper.class);
    public Response toResponse(Exception exception) {
        if (exception instanceof WebAppException) {
            Integer statusCode = ((WebAppException) exception).getErrorCode().getStatusCode();
            String errorMessage;
            Object exceptionLogger = null;
            if (statusCode >= 200 && statusCode < 300) {
                errorMessage = new WebAppError(exception.getMessage(), statusCode).toString();
                exceptionLogger = exception;
            } else if (statusCode == 599) {
                //Run time error, it includes IOE, Exception, ...
                //Need not to log exception again as it is already logged
                errorMessage = new WebAppError(exception.getMessage(), statusCode).toString();
                exceptionLogger = errorMessage;
            } else {
                errorMessage = new WebAppError(exception.getMessage()).toString();
                exceptionLogger = exception;
            }
            logger.info("WebAppException : {}", exceptionLogger);
            return Response.status(statusCode).entity(errorMessage).type(MediaType.APPLICATION_JSON).build();
        } else if (exception instanceof TimeoutException) {
            return Response.status(Response.Status.GATEWAY_TIMEOUT).entity("{\"error\":\"Downstream service " +
                    "timeout..\"}").build();
        } else if (exception instanceof ServletException) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("{\"error\":\"Something went " +
                    "wrong\"}").type(MediaType.APPLICATION_JSON).build();
        }
        logger.info("Unknown exception found : {}", exception);
        return Response.status(Response.Status.NOT_FOUND).entity("{\"error\":\"" + exception.getMessage() +
            "\"}").type(MediaType.APPLICATION_JSON).build();
    }
}

class WebAppError {

    private String message;
    private Integer statusCode;

    public WebAppError(String message) {
        this.setMessage(message);
    }
    public WebAppError(String message, Integer statusCode) {
        this.setMessage(message);
        this.statusCode = statusCode;
    }


    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        if (statusCode != null && statusCode >= 200 && statusCode < 300) {
            String status = "FAILURE";
            return "{\"reason\" :" + "\"" + message + "\", \"status\" : \"" + status + "\"}";
        }
        return "{\"error\" :" + "\"" + message + "\"}";
    }
}
