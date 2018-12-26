package com.todo.interfaces;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.todo.common.TodoException;
import com.todo.model.CommandsDB;
import com.todo.utils.ErrorCodes;
import com.todo.utils.StringUtils;
import com.todo.utils.SystemUtils;
import com.todo.yaml.todo.Commands;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

public class CommandsFileData implements CommandsInterface {
    private static Logger LOGGER = LoggerFactory.getLogger(CommandsFileData.class);
    private ArrayList<String> commandsFilePath;
    public CommandsFileData(ArrayList<String> commandsFilePath) {
        this.commandsFilePath = commandsFilePath;
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
    public CommandsDB getCommandsDB() throws TodoException {
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
        return commandsDB;
    }
}
