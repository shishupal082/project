package com.todo.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.todo.TodoConfiguration;
import com.todo.config.DirectoryConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;

/**
 * Created by shishupalkumar on 14/02/17.
 */
public class ConfigService {
    private static Logger logger = LoggerFactory.getLogger(ConfigService.class);
    private TodoConfiguration todoConfiguration;
    public ConfigService(TodoConfiguration todoConfiguration) {
        this.todoConfiguration = todoConfiguration;
    }
    public DirectoryConfig updateDirectoryConfig() {
        DirectoryConfig directoryConfig = null;
        ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
        String directoryConfigPath = todoConfiguration.getTodoDirectoryConfigPath();
        try {
            directoryConfig = mapper.readValue(new File(directoryConfigPath),
                DirectoryConfig.class);
        } catch (IOException ioe) {
            logger.info("IOE : for file : {}", directoryConfigPath);
        }
        todoConfiguration.setDirectoryConfig(directoryConfig);
        logger.info("TodoConfiguration : DirectoryConfig : updated");
        return directoryConfig;
    }
    public static DirectoryConfig updateStaticDirectoryConfig(TodoConfiguration todoConfiguration) {
        ConfigService configService = new ConfigService(todoConfiguration);
        configService.updateDirectoryConfig();
        return todoConfiguration.getDirectoryConfig();
    }
}
