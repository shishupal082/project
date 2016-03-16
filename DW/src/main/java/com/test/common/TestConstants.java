package com.test.common;

/**
 *
 */
public class TestConstants {

    public static final String APP_NAME = "test-api";
    public static final String CONTENT_TYPE_HEADER = "Content-Type";
    public static final String CONTENT_TYPE_APPLICATION_JSON = "application/json";

    //log filter constant
    public static final String LOG_X_TRANSACTION_KEY="X-Transaction-Key";

    /**
     * Callers need to use static references to refer to the constants in this class. Since callers
     * will never need to create an object of this class, the constructor is made private to enforce
     * this.
     */
    private TestConstants() {
    }

}
