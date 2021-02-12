package com.project.communication.config;

public enum AppReferenceEnum {
    ZERO("0"), // client
    ONE("1"), // server
    TWO("2"),
    THREE("3"),
    FOUR("4"); // i.e. both server & client
    private final String appReference;
    AppReferenceEnum(String appReference) {
        this.appReference = appReference;
    }
    public String getAppReference() {
        return appReference;
    }
}
