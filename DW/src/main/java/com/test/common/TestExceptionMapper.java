package com.test.common;


import java.util.concurrent.TimeoutException;

import javax.servlet.ServletException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

@Provider
public class TestExceptionMapper implements ExceptionMapper<Exception> {

    @Override
    public Response toResponse(Exception exception) {

        if (exception instanceof TestException) {
            Integer statusCode = ((TestException) exception).getErrorCode().getStatusCode();
            String errorMessage;
            if (statusCode >= 200 && statusCode < 300) {
                errorMessage = new TestError(exception.getMessage(), statusCode).toString();
            } else {
                errorMessage = new TestError(exception.getMessage()).toString();
            }
            return Response.status(statusCode).entity(errorMessage).type(MediaType.APPLICATION_JSON).build();
        } else if (exception instanceof TimeoutException) {
            return Response.status(Response.Status.GATEWAY_TIMEOUT).entity("{\"error\":\"Downstream service " +
                    "timeout..\"}").build();
        } else if (exception instanceof ServletException) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("{\"error\":\"Something went " +
                    "wrong\"}").type(MediaType.APPLICATION_JSON).build();
        }
        return null;
    }
}

class TestError {

    private String message;
    private Integer statusCode;

    public TestError(String message) {
        this.setMessage(message);
    }
    public TestError(String message, Integer statusCode) {
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
