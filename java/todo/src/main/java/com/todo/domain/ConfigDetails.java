package com.todo.domain;

import com.todo.TodoConfiguration;
import com.todo.config.AppConfig;
import com.todo.services.ConfigService;
import com.todo.task.config.TaskConfig;
import com.todo.task.service.TaskService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.jar.Pack200;

/**
 * Created by shishupalkumar on 19/02/17.
 */
public class ConfigDetails {
    private static Logger logger = LoggerFactory.getLogger(ConfigDetails.class);
    private TodoConfiguration todoConfiguration;
    public ConfigDetails(TodoConfiguration todoConfiguration) {
        this.todoConfiguration = todoConfiguration;
    }
    public Map<String, String> getConfigFileMapper() {
        String yamlObjectPathName = "todoConfiguration.yamlObjectPath";
        String availableResourcePathName = "todoConfiguration.availableResourcePath";
        String appConfigPathName = "todoConfiguration.appConfigPath";
        String taskItemsPathName = "todoConfiguration.appConfigPath.taskItemsPath";
        String taskComponentPathName = "todoConfiguration.appConfigPath.taskComponentPath";
        String taskApplicationPathName = "todoConfiguration.appConfigPath.taskApplicationPath";
        String taskHistoryPaths = "todoConfiguration.appConfigPath.taskHistoryPath";

        Map<String, String> configFilesMapper = new HashMap<String, String>();
        if (todoConfiguration == null) {
            logger.info("todoConfiguration is null : returning empty map.");
            return configFilesMapper;
        }
        configFilesMapper.put(yamlObjectPathName, todoConfiguration.getYamlObjectPath());
        configFilesMapper.put(availableResourcePathName, todoConfiguration.getAvailableResourcePath());
        configFilesMapper.put(appConfigPathName, todoConfiguration.getAppConfigPath());
        AppConfig appConfig = ConfigService.getAppConfig(todoConfiguration.getAppConfigPath());
        for (int i=0; i<appConfig.getTaskItemsPath().length; i++) {
            configFilesMapper.put(taskItemsPathName + "." + i, appConfig.getTaskItemsPath()[i]);
        }
        for (int i=0; i<appConfig.getTaskComponentPath().length; i++) {
            configFilesMapper.put(taskComponentPathName + "." + i, appConfig.getTaskComponentPath()[i]);
        }
        for (int i=0; i<appConfig.getTaskApplicationPath().length; i++) {
            configFilesMapper.put(taskApplicationPathName + "." + i, appConfig.getTaskApplicationPath()[i]);
        }
        for (int i=0; i<appConfig.getTaskHistoryPath().length; i++) {
            configFilesMapper.put(taskHistoryPaths + "." + i, appConfig.getTaskHistoryPath()[i]);
        }
        return configFilesMapper;
    }
    public ArrayList<String> getConfigFiles() {
        ArrayList<String> configFiles = new ArrayList<String>();
        ConfigDetails configDetails = new ConfigDetails(todoConfiguration);
        for (Map.Entry<String, String> entry : configDetails.getConfigFileMapper().entrySet()) {
            configFiles.add(entry.getKey());
        }
        Collections.sort(configFiles);
        return configFiles;
    }
}
