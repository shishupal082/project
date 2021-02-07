package com.project.communication.config;

public enum AppReference {
    ZERO("0"),
    ONE("1"),
    TWO("2"),
    THREE("3"),
    FOUR("4"); // i.e. both server & client
    private final String appReference;
    AppReference(String appReference) {
        this.appReference = appReference;
    }
    public String getAppReference() {
        return appReference;
    }
}
