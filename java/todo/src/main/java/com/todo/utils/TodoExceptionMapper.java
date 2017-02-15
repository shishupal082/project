package com.todo.utils;


import javax.servlet.ServletException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;
import java.util.concurrent.TimeoutException;

@Provider
public class TodoExceptionMapper implements ExceptionMapper<Exception> {
    public Response toResponse(Exception exception) {
        if (exception instanceof TodoException) {
            Integer statusCode = ((TodoException) exception).getErrorCode().getStatusCode();
            String errorMessage;
            if (statusCode >= 200 && statusCode < 300) {
                errorMessage = new TodoError(exception.getMessage(), statusCode).toString();
            } else {
                errorMessage = new TodoError(exception.getMessage()).toString();
            }
            return Response.status(statusCode).entity(errorMessage).type(MediaType.APPLICATION_JSON).build();
        } else if (exception instanceof TimeoutException) {
            return Response.status(Response.Status.GATEWAY_TIMEOUT).entity("{\"error\":\"Downstream service " +
                    "timeout..\"}").build();
        } else if (exception instanceof ServletException) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("{\"error\":\"Something went " +
                    "wrong\"}").type(MediaType.APPLICATION_JSON).build();
        }
        return Response.status(500).entity("{\"error\":" + exception.getMessage() + "}").build();
    }
}

class TodoError {

    private String message;
    private Integer statusCode;

    public TodoError(String message) {
        this.setMessage(message);
    }
    public TodoError(String message, Integer statusCode) {
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