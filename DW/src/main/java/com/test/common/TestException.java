package com.test.common;
/**
 *
 */

public class TestException extends RuntimeException {

    private TestErrorCodes errorCode;
    private static final long serialVersionUID = -3853689944157298314L;

    public TestException(TestErrorCodes errorCode) {
        super(errorCode.getErrorString());
        this.errorCode = errorCode;
    }

    public TestException(String s) {
        super(s);
    }

    public TestException(int errorCode, String msg) {
        super(msg);
        if (errorCode >= 300 && errorCode <= 399) {
            this.errorCode = TestErrorCodes.REDIRECTION_ERROR;
        } else if (errorCode >= 400 && errorCode <= 499) {
            this.errorCode = TestErrorCodes.BAD_REQUEST_ERROR;
        } else if (errorCode >= 500 && errorCode <= 599) {
            this.errorCode = TestErrorCodes.SERVER_ERROR;
        }
    }


    public TestException(TestErrorCodes errorCode, String msg) {
        super(msg);
        this.errorCode = errorCode;
    }

    public TestException(TestErrorCodes errorCode, String msg, Throwable cause) {
        super(msg, cause);
        this.errorCode = errorCode;
    }

    public TestException(TestErrorCodes errorCode, Throwable cause) {
        super(cause);
        this.errorCode = errorCode;
    }

    public TestErrorCodes getErrorCode() {
        return errorCode;
    }

    public Integer getStatusCode() {
        return this.errorCode.getStatusCode();
    }
}
