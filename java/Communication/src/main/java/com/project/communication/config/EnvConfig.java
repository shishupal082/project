package com.project.communication.config;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.project.communication.obj.ProtocolConfig;

import java.util.HashMap;

@JsonIgnoreProperties(ignoreUnknown = true)

public class EnvConfig {
    private String logFilepath;
    private HashMap<String, ProtocolConfig> programConfig;

    public String getLogFilepath() {
        return logFilepath;
    }

    public void setLogFilepath(String logFilepath) {
        this.logFilepath = logFilepath;
    }

    public HashMap<String, ProtocolConfig> getProgramConfig() {
        return programConfig;
    }

    public void setProgramConfig(HashMap<String, ProtocolConfig> programConfig) {
        this.programConfig = programConfig;
    }

    @Override
    public String toString() {
        return "EnvConfig{" +
                "logFilepath='" + logFilepath + '\'' +
                ", programConfig=" + programConfig +
                '}';
    }
}
