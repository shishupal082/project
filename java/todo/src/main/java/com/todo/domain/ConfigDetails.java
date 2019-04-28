package com.todo.domain;

import com.todo.TodoConfiguration;
import com.todo.yaml.todo.AppConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

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
        String taskApplicationPathName = "todoConfiguration.appConfigPath.taskApplicationPath";

        Map<String, String> configFilesMapper = new HashMap<String, String>();
        if (todoConfiguration == null) {
            logger.info("todoConfiguration is null : returning empty map.");
            return configFilesMapper;
        }
        configFilesMapper.put(yamlObjectPathName, todoConfiguration.getYamlObjectPath());
        configFilesMapper.put(availableResourcePathName, todoConfiguration.getAvailableResourcePath());
        AppConfig appConfig = todoConfiguration.getConfigInterface().getAppConfig();
        for (int i=0; i<todoConfiguration.getAppConfigPath().size(); i++) {
            configFilesMapper.put(appConfigPathName + "." + i, todoConfiguration.getAppConfigPath().get(i));
        }
        for (int i = 0; i< appConfig.getTaskItemsPath().size(); i++) {
            configFilesMapper.put(taskItemsPathName + "." + i, appConfig.getTaskItemsPath().get(i));
        }
        for (int i = 0; i< appConfig.getTaskApplicationPath().size(); i++) {
            configFilesMapper.put(taskApplicationPathName + "." + i, appConfig.getTaskApplicationPath().get(i));
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
