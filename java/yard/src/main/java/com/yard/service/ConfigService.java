package com.yard.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.yard.YardConfiguration;
import com.yard.exceptions.YardException;
import com.yard.objects.AppConfig;
import com.yard.utils.ErrorCodes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;

public class ConfigService {

    private static Logger logger = LoggerFactory.getLogger(ConfigService.class);
    public ConfigService(final YardConfiguration yardConfiguration) {
        logger.info("Loading yard configuration.");
        AppConfig appConfig = ConfigService.getAppConfig(yardConfiguration.getAppConfigPath());
        yardConfiguration.setAppConfig(appConfig);
        logger.info(yardConfiguration.toString());

    }

    private static AppConfig getAppConfig(String appConfigPath) {
        AppConfig appConfig = null;
        if (appConfigPath != null) {
            ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
            try {
                appConfig = mapper.readValue(new File(appConfigPath), AppConfig.class);
            } catch (IOException ioe) {
                logger.info("IOE : for file : {}", appConfigPath);
                appConfig = new AppConfig();
            }
        } else {
            logger.info("appConfigPath is null");
            appConfig = new AppConfig();
        }
        return appConfig;
    }
}
