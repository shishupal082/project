package com.todo.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.todo.TodoConfiguration;
import com.todo.config.AppConfig;
import com.todo.config.ResourceDetails;
import com.todo.domain.project_static_data.ProjectStaticData;
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
import java.util.ArrayList;

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
    public static AppConfig getAppConfig(ArrayList<String> appConfigPath) {
        if (appConfigPath == null || appConfigPath.isEmpty()) {
            logger.info("Invalid app config");
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        AppConfig appConfig = null, tempAppConfig = null;
        for (String fileName : appConfigPath) {
            try {
                tempAppConfig = mapper.readValue(new File(fileName), AppConfig.class);
                if (appConfig == null) {
                    appConfig = new AppConfig();
                }
                appConfig.merge(tempAppConfig);
            } catch (IOException ioe) {
                logger.info("IOE : for file : {}, {}", fileName, ioe);
                logger.info("Current working directory is : {}", System.getProperty("user.dir"));
            }
        }
        if (appConfig == null) {
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        return appConfig;
    }
    public void updateAppConfig(ArrayList<String> appConfigPath) throws TodoException {
        AppConfig tempAppConfig = getAppConfig(appConfigPath);
        logger.info("AppConfig loaded with data : {}", tempAppConfig);
        if (appConfig == null) {
            appConfig =tempAppConfig;
        } else {
            tempAppConfig.setTaskConfig(appConfig.getTaskConfig());
            tempAppConfig.setFilesConfig(appConfig.getFilesConfig());
            tempAppConfig.setProjectStaticData(appConfig.getProjectStaticData());
            appConfig = tempAppConfig;
        }
    }
    public void updateTaskConfig() throws TodoException {
        TaskConfig taskConfig = new TaskConfig();
        TaskUpdateService.updateTaskItems(taskConfig, appConfig.getTaskItemsPath());
        TaskUpdateService.updateTaskApplication(taskConfig, appConfig.getTaskApplicationPath());
        TaskUpdateService.updateTaskComponents(taskConfig);
        logger.info("Final taskItem data : {}", taskConfig.getTaskItems());
        logger.info("Final taskApplication data : {}", taskConfig.getTaskApplications());
        appConfig.setTaskConfig(taskConfig);
    }
    public void updateFilesConfig() throws TodoException {
        FilesConfig filesConfig = new FilesConfig();
        filesConfig.setMessageSavePath(appConfig.getMessageSavePath());
        filesConfig.setRelativePath(appConfig.getRelativePath());
        filesConfig.setUiPath(appConfig.getUiPath());
        filesConfig.setAddTextPath(appConfig.getAddTextPath());
        appConfig.setFilesConfig(filesConfig);
    }
    public void updateProjectStaticData(ArrayList<String> projectStaticDataConfigPath)
            throws TodoException {
        ProjectStaticData projectStaticData = new ProjectStaticData();
        if (projectStaticDataConfigPath == null) {
            logger.info("projectStaticDataConfigPath is NULL");
        } else {
            ProjectStaticData tempProjectStaticData;
            for (String fileName : projectStaticDataConfigPath) {
                logger.info("Processing projectStaticData from : {}", fileName);
                try {
                    tempProjectStaticData = mapper.readValue(new File(fileName),
                            ProjectStaticData.class);
                    if (tempProjectStaticData != null) {
                        projectStaticData.merge(tempProjectStaticData);
                    }
                } catch (IOException ioe) {
                    logger.info("IOE : for file : {}, {}", fileName, ioe);
                    logger.info("Current working directory is : {}", System.getProperty("user.dir"));
                }
            }
        }
        logger.info("Final projectStaticData : {}", projectStaticData);
        appConfig.setProjectStaticData(projectStaticData);
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
    public ResourceDetails getResourceDetails(String resourcePath) throws TodoException {
        ResourceDetails resourceDetails = null;
        ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
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
