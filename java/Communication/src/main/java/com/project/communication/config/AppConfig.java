package com.project.communication.config;

import com.project.communication.common.FileLogger;

public class AppConfig {
    private FileLogger fileLogger;
    public AppConfig(EnvConfig envConfig) {
        this.setFileLogger(new FileLogger(envConfig.getLogFilepath()));
    }
    public FileLogger getFileLogger() {
        return fileLogger;
    }

    public void setFileLogger(FileLogger fileLogger) {
        this.fileLogger = fileLogger;
    }
}
