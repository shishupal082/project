package com.project.communication.common;

public class LoggerV2 {
    private final String pattern;
    private String logFilename;
    private String prePattern = "";
    private String postPattern = "";
    public LoggerV2(String pattern) {
        this.pattern = pattern;
    }

    public void setPrePattern(String prePattern) {
        this.prePattern = prePattern;
    }

    public void setPostPattern(String postPattern) {
        this.postPattern = postPattern;
    }

    public void info(String logText) {
        System.out.println(prePattern+pattern+postPattern+logText);
    }
    public void info(int logText) {
        System.out.println(prePattern+pattern+postPattern+logText);
    }
    public void info(StringBuilder stringBuilder) {
        System.out.println(prePattern+pattern+postPattern+stringBuilder);
    }
    public void info(String logPattern, String logText) {
        System.out.println(prePattern+pattern+postPattern+logText);
    }

    public void info(String logPattern, String logText, String logText2) {
        System.out.println(prePattern+pattern+postPattern+logText+logText2);
    }
}
