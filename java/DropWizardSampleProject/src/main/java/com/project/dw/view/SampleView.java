package com.project.dw.view;

import com.project.dw.SampleConfiguration;
import com.project.dw.common.AppConstant;
import io.dropwizard.views.View;

public class SampleView extends View {
    private String appVersion;
    private String userMessage;
    public SampleView(String pageName, SampleConfiguration configuration) {
        super(pageName);
        this.appVersion = AppConstant.appVersion;
        this.userMessage = configuration.getUserMessage();
    }

    public String getAppVersion() {
        return appVersion;
    }

    public void setAppVersion(String appVersion) {
        this.appVersion = appVersion;
    }

    public String getUserMessage() {
        return userMessage;
    }

    public void setUserMessage(String userMessage) {
        this.userMessage = userMessage;
    }
}
