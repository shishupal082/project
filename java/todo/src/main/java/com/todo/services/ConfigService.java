package com.todo.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.todo.TodoConfiguration;
import com.todo.config.AppConfig;
import com.todo.config.ResourceDetails;
import com.todo.file.config.FilesConfig;
import com.todo.model.YamlObject;
import com.todo.task.config.TaskConfig;
import com.todo.task.service.TaskUpdateService;
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
    private static ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
    private TodoConfiguration todoConfiguration;
    private AppConfig appConfig;
    public ConfigService(TodoConfiguration todoConfiguration) {
        this.todoConfiguration = todoConfiguration;
    }
    public static AppConfig getAppConfig(String appConfigPath) {
        AppConfig appConfig = null;
        try {
            appConfig = mapper.readValue(new File(appConfigPath), AppConfig.class);
        } catch (IOException ioe) {
            logger.info("IOE : for file : {}, {}", appConfigPath, ioe);
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        return appConfig;
    }
    public void updateAppConfig(String appConfigPath) throws TodoException {
        this.appConfig = new AppConfig();
        updateFilesConfig(appConfig, appConfigPath);
        updateTaskConfig(appConfig, appConfigPath);
    }
    public void updateTaskConfig(AppConfig appConfig, String appConfigPath) throws TodoException {
        AppConfig tempAppConfig = getAppConfig(appConfigPath);
        logger.info("TampAppConfig loaded with data : {}", tempAppConfig);
        TaskConfig taskConfig = new TaskConfig();
        TaskUpdateService.updateTaskItems(taskConfig, tempAppConfig.getTaskItemsPath());
        TaskUpdateService.updateTaskComponents(taskConfig, tempAppConfig.getTaskComponentPath());
        TaskUpdateService.updateTaskApplication(taskConfig, tempAppConfig.getTaskApplicationPath());
        appConfig.setTaskConfig(taskConfig);
    }
    public void updateFilesConfig(AppConfig appConfig, String appConfigPath) throws TodoException {
        FilesConfig filesConfig = new FilesConfig();
        AppConfig tempAppConfig = getAppConfig(appConfigPath);
        filesConfig.setMessageSavePath(tempAppConfig.getMessageSavePath());
        filesConfig.setRelativePath(tempAppConfig.getRelativePath());
        filesConfig.setUiPath(tempAppConfig.getUiPath());
        appConfig.setFilesConfig(filesConfig);
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
    public AppConfig getAppConfig() throws TodoException {
        return appConfig;
    }
    public TaskConfig getTaskConfig() throws TodoException {
        return appConfig.getTaskConfig();
    }
    public FilesConfig getFileConfig() {
        return appConfig.getFilesConfig();
    }

}
