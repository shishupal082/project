package com.project.communication.obj;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.HashMap;

@JsonIgnoreProperties(ignoreUnknown = true)

public class EnvConfig {
    private HashMap<String, ProtocolConfig> programConfig;

    public HashMap<String, ProtocolConfig> getProgramConfig() {
        return programConfig;
    }

    public void setProgramConfig(HashMap<String, ProtocolConfig> programConfig) {
        this.programConfig = programConfig;
    }

    @Override
    public String toString() {
        return "EnvConfig{" +
                "programConfig=" + programConfig +
                '}';
    }
}
