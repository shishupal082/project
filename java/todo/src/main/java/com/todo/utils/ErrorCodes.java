package com.todo.utils;

/**
 * Created by shishupalkumar on 10/02/17.
 */

public enum ErrorCodes {
    REDIRECTION_ERROR("Routing error", "Routing error", 300),
    UNABLE_TO_PARSE_JSON("Unable to parse Json", "Unable to parse Json", 400),
    BAD_REQUEST_ERROR("Bad request error", "Bad request error", 401),
    FILE_NOT_FOUND("File not found", "File not found", 402),
    INVALID_QUERY_PARAMS("Invalid query params", "Invalid query params", 403),
    DUPLICATE_ENTRY("Duplicate entry", "Duplicate entry", 405),
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
