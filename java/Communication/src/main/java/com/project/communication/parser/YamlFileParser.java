package com.project.communication.parser;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.EnvConfig;

import java.io.File;
import java.io.IOException;

public class YamlFileParser {
    final static LoggerV2 logger = LoggerFactoryV2.getLogger(YamlFileParser.class);
    public YamlFileParser() {}
    public static EnvConfig getEnvConfig(String configFilePath) {
        if (configFilePath == null) {
            return null;
        }
        EnvConfig envConfig = null;
        ObjectMapper objectMapper = new ObjectMapper(new YAMLFactory());
        try {
            envConfig = objectMapper.readValue(new File(configFilePath), EnvConfig.class);
        } catch (IOException ioe) {
            logger.info("IOE : for file : " + configFilePath);
        }
        if (envConfig == null) {
            envConfig = new EnvConfig();
        }
        return envConfig;
    }

}
