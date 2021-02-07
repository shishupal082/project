package com.project.communication.common;

import com.project.communication.CommApplication;

public class LoggerV2 {
    private final String pattern;
    private String prePattern = "";
    private String postPattern = "";
    private FileLogger fileLogger = null;
    private static String uuid;
    public LoggerV2(String pattern) {
        this.pattern = pattern;
        if (CommApplication.appConfig != null) {
            fileLogger = CommApplication.appConfig.getFileLogger();
        }
    }

    public static void setUuid(String uuid) {
        LoggerV2.uuid = uuid;
    }

    public void setPrePattern(String prePattern) {
        this.prePattern = prePattern;
    }

    public void setPostPattern(String postPattern) {
        this.postPattern = postPattern;
    }
    private void addText(String text) {
        if (fileLogger != null) {
            fileLogger.addToFile(uuid + ":" + text);
        }
        System.out.println(uuid + ":" + text);
    }
    public void infoDirect(String logText) {
        this.addText(logText);
    }
    public void info(String logText) {
        this.addText(prePattern+pattern+postPattern+logText);
    }
    public void info(int logText) {
        this.addText(prePattern+pattern+postPattern+logText);
    }
    public void info(StringBuilder stringBuilder) {
        this.addText(prePattern+pattern+postPattern+stringBuilder);
    }
    public void info(String logPattern, String logText) {
        this.addText(prePattern+pattern+postPattern+logText);
    }

    public void info(String logPattern, String logText, String logText2) {
        this.addText(prePattern+pattern+postPattern+logText+logText2);
    }
}
