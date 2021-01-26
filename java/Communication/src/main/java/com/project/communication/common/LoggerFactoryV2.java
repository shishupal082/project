package com.project.communication.common;

public class LoggerFactoryV2 {
    public static LoggerV2 getLogger(Class<?> clazz) {
        String[] classExt = clazz.getCanonicalName().split("\\.");
        String initials = "";
        int i;
        for (i=0; i<classExt.length-1; i++) {
            initials += classExt[i].charAt(0)+".";
        }
        initials += classExt[i];
        LoggerV2 loggerV2 = new LoggerV2(initials);
        loggerV2.setPostPattern(": ");
        return loggerV2;
    }
}
