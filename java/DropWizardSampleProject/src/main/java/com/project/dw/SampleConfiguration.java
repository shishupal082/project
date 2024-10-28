package com.project.dw;

import io.dropwizard.Configuration;

public class SampleConfiguration  extends Configuration {
    private String userMessage;

    public String getUserMessage() {
        return userMessage;
    }

    public void setUserMessage(String userMessage) {
        this.userMessage = userMessage;
    }

    @Override
    public String toString() {
        return "SampleConfiguration{" +
                "userMessage='" + userMessage + '\'' +
                '}';
    }
}
