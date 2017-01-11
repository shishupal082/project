package com.todo;

import com.todo.config.TestConfig;
import io.dropwizard.Configuration;

/**
 * Created by shishupalkumar on 11/01/17.
 */

public class TodoConfiguration extends Configuration {
    private TestConfig testConfig;

    public TestConfig getTestConfig() {
        return testConfig;
    }

    public void setTestConfig(TestConfig testConfig) {
        this.testConfig = testConfig;
    }
}
