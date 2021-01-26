package com.project.communication.config;

public enum ApplicationName {
    SERVER("server"),
    CLIENT("client"),
    INTERCEPTOR("interceptor"); // i.e. both server & client
    private final String applicationName;
    ApplicationName(String applicationName) {
        this.applicationName = applicationName;
    }
    public String getApplicationName() {
        return applicationName;
    }
}
