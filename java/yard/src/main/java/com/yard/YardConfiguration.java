package com.yard;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.yard.objects.AppConfig;
import com.yard.objects.TestConfig;
import io.dropwizard.Configuration;
import java.util.ArrayList;

@JsonIgnoreProperties(ignoreUnknown = true)
public class YardConfiguration extends Configuration{

    private TestConfig testConfig;
    private String appConfigPath;

    /* Locally generated configuration */
    private AppConfig appConfig;
    /* Locally generated configuration ends */

    public TestConfig getTestConfig() {
        return testConfig;
    }

    public void setTestConfig(TestConfig testConfig) {
        this.testConfig = testConfig;
    }

    public String getAppConfigPath() {
        return appConfigPath;
    }

    public void setAppConfigPath(String appConfigPath) {
        this.appConfigPath = appConfigPath;
    }

    public AppConfig getAppConfig() {
        return appConfig;
    }

    public void setAppConfig(AppConfig appConfig) {
        this.appConfig = appConfig;
    }

    @Override
    public String toString() {
        return "YardConfiguration{" +
                "testConfig=" + testConfig +
                ", appConfigPath='" + appConfigPath + '\'' +
                ", appConfig=" + appConfig +
                '}';
    }
}
