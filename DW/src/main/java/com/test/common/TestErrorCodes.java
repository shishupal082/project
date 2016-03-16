package com.test.common;

/**
 *
 */

public enum TestErrorCodes {

    BAD_REQUEST_ERROR("BAD_REQUEST_ERROR:F-9000-01", "Bad Request Error", 400),
    SERVER_ERROR("SERVER_ERROR:F-9000-01", "Server Error", 500),
    REDIRECTION_ERROR("REDIRECTION_ERROR:F-9000-01", "Redirection Error", 300);

    private final String errorCode;
    private final String errorString;
    private final Integer statusCode;

    TestErrorCodes(String errorCode, String errorString, Integer statusCode) {
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
