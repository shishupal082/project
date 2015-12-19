package com.test;

/**
 * Created by shishupal.kumar on 19/12/15.
 */

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.test.config.TestConfig;
import io.dropwizard.Configuration;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TestConfiguration extends Configuration {
    private TestConfig testConfig;

    public TestConfig getTestConfig() {
        return testConfig;
    }

    public void setTestConfig(TestConfig testConfig) {
        this.testConfig = testConfig;
    }
}
