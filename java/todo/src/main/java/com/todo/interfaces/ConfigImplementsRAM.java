package com.todo.interfaces;

import com.todo.TodoConfiguration;
import com.todo.common.TodoException;
import com.todo.domain.project_static_data.ProjectStaticData;
import com.todo.model.CommandsDB;
import com.todo.model.TaskConfigDB;
import com.todo.yaml.todo.AppConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ConfigImplementsRAM implements ConfigInterface {
    private static Logger LOGGER = LoggerFactory.getLogger(ConfigImplementsRAM.class);
    private TodoConfiguration todoConfiguration;
    private AppConfig appConfig;
    private TaskConfigDB taskConfigDB;
    private ProjectStaticData projectStaticData;
    private CommandsDB commandsDB;
    public ConfigImplementsRAM(TodoConfiguration todoConfiguration) {
        this.todoConfiguration = todoConfiguration;
        updateAppConfig();
        updateTaskConfigDB(appConfig);
        updateProjectStaticData(appConfig);
        updateCommandsDB(appConfig);
    }

    public AppConfig getAppConfig() throws TodoException {
        return appConfig;
    }
    public AppConfig updateAppConfig() throws TodoException {
        ConfigImplementsFile configImplementsFile = new ConfigImplementsFile(todoConfiguration);
        appConfig = configImplementsFile.getAppConfig();
        return appConfig;
    }
    public TaskConfigDB getTaskConfigDB(AppConfig appConfig) throws TodoException {
        return taskConfigDB;
    }
    public TaskConfigDB updateTaskConfigDB(AppConfig appConfig) throws TodoException {
        ConfigImplementsFile configImplementsFile = new ConfigImplementsFile(todoConfiguration);
        taskConfigDB = configImplementsFile.getTaskConfigDB(appConfig);
        return taskConfigDB;
    }
    public ProjectStaticData getProjectStaticData(AppConfig appConfig) throws TodoException {
        return projectStaticData;
    }
    public ProjectStaticData updateProjectStaticData(AppConfig appConfig) throws TodoException {
        ConfigImplementsFile configImplementsFile = new ConfigImplementsFile(todoConfiguration);
        projectStaticData = configImplementsFile.getProjectStaticData(appConfig);
        return projectStaticData;
    }
    public CommandsDB getCommandsDB(AppConfig appConfig) {
        return commandsDB;
    }
    public CommandsDB updateCommandsDB(AppConfig appConfig) {
        ConfigImplementsFile configImplementsFile = new ConfigImplementsFile(todoConfiguration);
        commandsDB = configImplementsFile.getCommandsDB(appConfig);
        return commandsDB;
    }
}
