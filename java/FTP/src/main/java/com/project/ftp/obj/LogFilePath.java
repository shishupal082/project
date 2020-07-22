package com.project.ftp.obj;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)

public class LogFilePath {
    private String logFilePath;

    public String getLogFilePath() {
        return logFilePath;
    }

    public void setLogFilePath(String logFilePath) {
        this.logFilePath = logFilePath;
    }

    @Override
    public String toString() {
        return "LogFilePath{" +
                "logFilePath='" + logFilePath + '\'' +
                '}';
    }
}
