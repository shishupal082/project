package com.webapp.config;

import com.webapp.WebAppConfiguration;

public class WebAppConfig {
    private AppConfig appConfig;
    private WebAppConfiguration webAppConfiguration;

    public WebAppConfig(WebAppConfiguration webAppConfiguration) {
        this.webAppConfiguration = webAppConfiguration;
    }
    public AppConfig getAppConfig() {
        return appConfig;
    }

    public void setAppConfig(AppConfig appConfig) {
        this.appConfig = appConfig;
    }

    public WebAppConfiguration getWebAppConfiguration() {
        return webAppConfiguration;
    }

    public void setWebAppConfiguration(WebAppConfiguration webAppConfiguration) {
        this.webAppConfiguration = webAppConfiguration;
    }

    @Override
    public String toString() {
        return "WebAppConfig{" +
                "appConfig=" + appConfig +
                ", webAppConfiguration=" + webAppConfiguration +
                '}';
    }
}
