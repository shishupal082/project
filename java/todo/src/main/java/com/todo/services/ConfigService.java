package com.todo.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.todo.TodoConfiguration;
import com.todo.yaml.todo.AppConfig;
import com.todo.model.TaskConfigDB;
import com.todo.yaml.todo.ResourceDetails;
import com.todo.domain.project_static_data.ProjectStaticData;
import com.todo.interfaces.YamlObjectImplements;
import com.todo.model.YamlObjectDB;
import com.todo.parser.YamlObjectFileParser;
import com.todo.yaml.todo.YamlObject;
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
    private TaskConfigDB taskConfigDB;
    private YamlObjectDB yamlObjectDB;
    private ProjectStaticData projectStaticData;
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
        appConfig = tempAppConfig;
    }
    public void updateTaskConfig() throws TodoException {
        TaskConfigDB tempTaskConfigDB = new TaskConfigDB();
        TaskUpdateService.updateTaskItems(tempTaskConfigDB, appConfig.getTaskItemsPath());
        TaskUpdateService.updateTaskApplication(tempTaskConfigDB, appConfig.getTaskApplicationPath());
        TaskUpdateService.updateTaskComponents(tempTaskConfigDB);
        logger.info("Final taskItem data : {}", tempTaskConfigDB.getTaskItems());
        logger.info("Final taskApplication data : {}", tempTaskConfigDB.getTaskApplications());
        taskConfigDB = tempTaskConfigDB;
    }
    public void updateProjectStaticData(ArrayList<String> projectStaticDataConfigPath)
            throws TodoException {
        ProjectStaticData projectStaticDataV1 = new ProjectStaticData();
        if (projectStaticDataConfigPath == null) {
            logger.info("projectStaticDataConfigPath is NULL");
        } else {
            ProjectStaticData projectStaticDataV2;
            for (String fileName : projectStaticDataConfigPath) {
                logger.info("Processing projectStaticData from : {}", fileName);
                try {
                    projectStaticDataV2 = mapper.readValue(new File(fileName),
                            ProjectStaticData.class);
                    if (projectStaticDataV2 != null) {
                        projectStaticDataV1.merge(projectStaticDataV2);
                    }
                } catch (IOException ioe) {
                    logger.info("IOE : for file : {}, {}", fileName, ioe);
                    logger.info("Current working directory is : {}", System.getProperty("user.dir"));
                }
            }
        }
        logger.info("Final projectStaticData : {}", projectStaticDataV1);
        projectStaticData = projectStaticDataV1;
    }
    public void updateYamlObjectDBFromFile() throws TodoException {
        YamlObjectFileParser yamlObjectFileParser = new YamlObjectFileParser();
        YamlObjectImplements yamlObjectImplements = new YamlObjectImplements();
        YamlObject yamlObject = yamlObjectFileParser.getYamlObjectFromFilePath(todoConfiguration.getYamlObjectPath());
        yamlObjectDB = yamlObjectImplements.getYamlObjectDB(yamlObject);
        logger.info("yamlObjectDB updated from File");
    }
//    public void updateYamlObjectDBFromData(Integer age, String name) throws TodoException {
//        YamlObjectImplements yamlObjectImplements = new YamlObjectImplements();
//        YamlObject yamlObject = new YamlObject();
//        yamlObject.setAge(age);
//        yamlObject.setName(name);
//        yamlObjectDB = yamlObjectImplements.getYamlObjectDB(yamlObject);
//        logger.info("yamlObjectDB updated from data");
//    }
    public YamlObject getYamlObject() throws TodoException {
        return yamlObjectDB.getYamlObject();
    }
    public ResourceDetails getResourceDetails(String resourcePath) throws TodoException {
        ResourceDetails resourceDetails = null;
        ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
        try {
            resourceDetails = mapper.readValue(new File(resourcePath), ResourceDetails.class);
        } catch (IOException ioe) {
            logger.info("IOE : for file : {}", resourcePath, ioe);
            throw new TodoException(ErrorCodes.RUNTIME_ERROR);
        }
        return resourceDetails;
    }
    public AppConfig getAppConfig() throws TodoException {
        return appConfig;
    }
    public TaskConfigDB getTaskConfigDB() throws TodoException {
        return taskConfigDB;
    }
    public ProjectStaticData getProjectStaticData() throws TodoException {
        return projectStaticData;
    }
}
