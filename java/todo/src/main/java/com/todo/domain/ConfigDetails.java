package com.todo.domain;

import com.todo.TodoConfiguration;
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
    private Map<String, String> getConfigFileMapper() {
        String yamlObjectPathName = "todoConfiguration.yamlObjectPath";
        String availableResourcePathName = "todoConfiguration.availableResourcePath";
        String todoDirectoryConfigPathName = "todoConfiguration.todoDirectoryConfigPath";
        String taskConfigPathName = "todoConfiguration.taskConfigPath";
        String taskItemsPathName = "todoConfiguration.taskConfigPath.taskItemsPath";
        String taskComponentPathName = "todoConfiguration.taskConfigPath.taskComponentPath";
        String taskApplicationPathName = "todoConfiguration.taskConfigPath.taskApplicationPath";

        Map<String, String> configFilesMapper = new HashMap<String, String>();
        configFilesMapper.put(yamlObjectPathName, todoConfiguration.getYamlObjectPath());
        configFilesMapper.put(availableResourcePathName, todoConfiguration.getAvailableResourcePath());
        configFilesMapper.put(todoDirectoryConfigPathName, todoConfiguration.getTodoDirectoryConfigPath());
        configFilesMapper.put(taskConfigPathName, todoConfiguration.getTaskConfigPath());
        TaskConfig taskConfig = TaskService.getTaskConfig(todoConfiguration.getTaskConfigPath());
        for (int i=0; i<taskConfig.getTaskItemsPath().length; i++) {
            configFilesMapper.put(taskItemsPathName + "." + i, taskConfig.getTaskItemsPath()[i]);
        }
        for (int i=0; i<taskConfig.getTaskComponentPath().length; i++) {
            configFilesMapper.put(taskComponentPathName + "." + i, taskConfig.getTaskComponentPath()[i]);
        }
        for (int i=0; i<taskConfig.getTaskApplicationPath().length; i++) {
            configFilesMapper.put(taskApplicationPathName + "." + i, taskConfig.getTaskApplicationPath()[i]);
        }
        return configFilesMapper;
    }
    private ConfigDetails(TodoConfiguration todoConfiguration) {
        this.todoConfiguration = todoConfiguration;
    }
    public static ArrayList<String> getConfigFiles(TodoConfiguration todoConfiguration) {
        ArrayList<String> configFiles = new ArrayList<String>();
        ConfigDetails configDetails = new ConfigDetails(todoConfiguration);
        for (Map.Entry<String, String> entry : configDetails.getConfigFileMapper().entrySet()) {
            configFiles.add(entry.getKey());
        }
        Collections.sort(configFiles);
        return configFiles;
    }
    public static String getFilePath(TodoConfiguration todoConfiguration, String configFileName) {
        ConfigDetails configDetails = new ConfigDetails(todoConfiguration);
        Map<String, String> mapper = configDetails.getConfigFileMapper();
        String configFilePath = mapper.get(configFileName);
        if (configFilePath == null) {
            logger.info("configFileName : {}, not found in : {}", configFileName, mapper);
        }
        return configFilePath;
    }
}
