package com.project.ftp.exceptions;


/**
 * Created by shishupalkumar on 10/02/17.
 */
public class AppException extends RuntimeException {
    private ErrorCodes errorCode;

    public AppException(final ErrorCodes errorCode) {
        super(errorCode.getErrorString());
        this.errorCode = errorCode;
    }

    public AppException(final String str) {
        super(str);
    }

    public AppException(final int errorCode, final String msg) {
        super(msg);
        if (errorCode >= 300 && errorCode <= 399) {
            this.errorCode = ErrorCodes.REDIRECTION_ERROR;
        } else if (errorCode >= 400 && errorCode <= 499) {
            this.errorCode = ErrorCodes.BAD_REQUEST_ERROR;
        } else if (errorCode >= 500 && errorCode <= 599) {
            this.errorCode = ErrorCodes.SERVER_ERROR;
        }
    }


    public AppException(ErrorCodes errorCode, String msg) {
        super(msg);
        this.errorCode = errorCode;
    }

    public AppException(ErrorCodes errorCode, String msg, Throwable cause) {
        super(msg, cause);
        this.errorCode = errorCode;
    }

    public AppException(ErrorCodes errorCode, Throwable cause) {
        super(cause);
        this.errorCode = errorCode;
    }

    public ErrorCodes getErrorCode() {
        return errorCode;
    }

    public Integer getStatusCode() {
        return this.errorCode.getStatusCode();
    }
}
