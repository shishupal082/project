package com.todo.utils;

/**
 * Created by shishupalkumar on 10/02/17.
 */

public enum ErrorCodes {
    REDIRECTION_ERROR("Routing error", "Routing error", 300),
    UNABLE_TO_PARSE_JSON("Unable to parse Json", "Unable to parse Json", 400),
    BAD_REQUEST_ERROR("Bad request error", "Bad request error", 401),
    SERVER_ERROR("Server error", "Server error", 500);

    private String errorCode;
    private String errorString;
    private Integer statusCode;

    ErrorCodes(String errorCode, String errorString, Integer statusCode) {
        this.errorCode = errorCode;
        this.errorString = errorString;
        this.statusCode = statusCode;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public String getErrorString() {
        return errorString;
    }

    public Integer getStatusCode() {
        return statusCode;
    }
}
