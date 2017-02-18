package com.todo.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.todo.TodoConfiguration;
import com.todo.config.ResourceDetails;
import com.todo.model.YamlObject;
import com.todo.utils.ErrorCodes;
import com.todo.utils.TodoException;
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
    public YamlObject getYamlObject() throws TodoException {
        YamlObject yamlObject = null;
        ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
        String yamlObjectPath = todoConfiguration.getYamlObjectPath();
        try {
            yamlObject = mapper.readValue(new File(yamlObjectPath), YamlObject.class);
        } catch (IOException ioe) {
            logger.info("IOE : for file : {}", yamlObjectPath);
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        return yamlObject;
    }
    public ResourceDetails getResourceDetails() throws TodoException {
        ResourceDetails resourceDetails = null;
        ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
        String resourcePath = todoConfiguration.getAvailableResourcePath();
        try {
            resourceDetails = mapper.readValue(new File(resourcePath), ResourceDetails.class);
        } catch (IOException ioe) {
            logger.info("IOE : for file : {}", resourcePath);
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        return resourceDetails;
    }
}
