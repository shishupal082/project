package com.todo.interfaces;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.todo.TodoConfiguration;
import com.todo.common.TodoException;
import com.todo.domain.project_static_data.ProjectStaticData;
import com.todo.model.CommandsDB;
import com.todo.model.TaskConfigDB;
import com.todo.services.ConfigService;
import com.todo.task.service.TaskUpdateService;
import com.todo.utils.ErrorCodes;
import com.todo.utils.StringUtils;
import com.todo.utils.SystemUtils;
import com.todo.yaml.todo.AppConfig;
import com.todo.yaml.todo.Command;
import com.todo.yaml.todo.Commands;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

public class ConfigImplementsFile implements ConfigInterface {
    private static Logger LOGGER = LoggerFactory.getLogger(ConfigImplementsFile.class);
    private TodoConfiguration todoConfiguration;
    public ConfigImplementsFile(TodoConfiguration todoConfiguration) {
        this.todoConfiguration = todoConfiguration;
    }
    public AppConfig getAppConfig() throws TodoException {
        AppConfig appConfig = new AppConfig();
        try {
            appConfig = ConfigService.getAppConfig(todoConfiguration.getAppConfigPath());
            LOGGER.info("AppConfig loaded from files : {}", todoConfiguration.getAppConfigPath());
        } catch (TodoException toe) {
            LOGGER.info("Error in loading AppConfig from files : {}", todoConfiguration.getAppConfigPath());
        }
        return appConfig;
    }
    public AppConfig updateAppConfig() throws TodoException {
        throw new TodoException(ErrorCodes.CONFIG_ERROR_INVALID_STORAGE_TYPE);
    }
    public TaskConfigDB getTaskConfigDB(AppConfig appConfig) throws TodoException {
        if (appConfig == null) {
            appConfig = getAppConfig();
        }
        TaskConfigDB taskConfigDB = new TaskConfigDB();
        TaskUpdateService.updateTaskItems(taskConfigDB, appConfig.getTaskItemsPath());
        TaskUpdateService.updateTaskApplication(taskConfigDB, appConfig.getTaskApplicationPath());
        TaskUpdateService.updateTaskComponents(taskConfigDB);
        LOGGER.info("Final taskItem data : {}", taskConfigDB.getTaskItems());
        LOGGER.info("Final taskApplication data : {}", taskConfigDB.getTaskApplications());
        return taskConfigDB;
    }
    public TaskConfigDB updateTaskConfigDB(AppConfig appConfig) throws TodoException {
        throw new TodoException(ErrorCodes.CONFIG_ERROR_INVALID_STORAGE_TYPE);
    }
    public ProjectStaticData getProjectStaticData(AppConfig appConfig) throws TodoException {
        if (appConfig == null) {
            appConfig = getAppConfig();
        }
        ArrayList<String> projectStaticDataConfigPath = appConfig.getProjectStaticDataConfigPath();
        ProjectStaticData projectStaticDataV1 = new ProjectStaticData();
        try {
            projectStaticDataV1 = ConfigService.getProjectStaticData(projectStaticDataConfigPath);
            LOGGER.info("Project static data loaded from files : {}", projectStaticDataConfigPath);
        } catch (TodoException toe) {
            LOGGER.info("Error in loading ProjectStatic data from files : {}", projectStaticDataConfigPath);
        }
        LOGGER.info("Final projectStaticData : {}", projectStaticDataV1);
        return projectStaticDataV1;
    }
    public ProjectStaticData updateProjectStaticData(AppConfig appConfig) throws TodoException {
        throw new TodoException(ErrorCodes.CONFIG_ERROR_INVALID_STORAGE_TYPE);
    }
    private Commands getCommandsFromFilePath(String commandFilePath) throws TodoException {
        ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
        Commands commands = null;
        try {
            commands = mapper.readValue(new File(commandFilePath), Commands.class);
            LOGGER.info("Commands loaded from file: {}", commandFilePath);
        } catch (IOException ioe) {
            LOGGER.info("IOE : for file : {}", StringUtils.getLoggerObject(commandFilePath, ioe));
            throw new TodoException(ErrorCodes.CONFIG_ERROR_INVALID_PATH);
        }
        return commands;
    }
    public CommandsDB getCommandsDB(AppConfig appConfig) throws TodoException {
        if (appConfig == null) {
            appConfig = getAppConfig();
        }
        if (appConfig == null || appConfig.getCommandConfig() == null) {
            LOGGER.info("appConfig or commandConfig is null");
            throw new TodoException(ErrorCodes.CONFIG_ERROR_INVALID_PATH);
        }
        ArrayList<String> commandsFilePath = getAppConfig().getCommandConfig().getCommandFilePaths();
        CommandsDB commandsDB = new CommandsDB();
        Commands commands = null;
        if (commandsFilePath != null) {
            for (String commandsFilePathStr : commandsFilePath) {
                commands = getCommandsFromFilePath(commandsFilePathStr);
                commandsDB.updateCommandsDBFromCommands(commands);
            }
        } else {
            LOGGER.info("commandsFilePath are null");
            throw new TodoException(ErrorCodes.CONFIG_ERROR_INVALID_PATH);
        }

        if (commandsDB.getCommandList() != null) {
            ArrayList<Command> commandList = commandsDB.getCommandList();
            ArrayList<String> tempCommandIds = new ArrayList<String>();
            for(Command command: commandList) {
                if (tempCommandIds.contains(command.getId())) {
                    LOGGER.info("Duplicate entry found for commandId : {}, {}, {}",
                            StringUtils.getLoggerObject(command.getId(), command, tempCommandIds));
                    throw new TodoException(ErrorCodes.DUPLICATE_ENTRY);
                }
                tempCommandIds.add(command.getId());
            }
        }
        LOGGER.info("CommandsDB loaded, Final commandsDB: {}", commandsDB);
        return commandsDB;
    }
    public CommandsDB updateCommandsDB(AppConfig appConfig) throws TodoException {
        throw new TodoException(ErrorCodes.CONFIG_ERROR_INVALID_STORAGE_TYPE);
    }
}
