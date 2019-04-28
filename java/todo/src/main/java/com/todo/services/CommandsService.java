package com.todo.services;

import com.todo.TodoConfiguration;
import com.todo.common.TodoException;
import com.todo.constants.AppConstant;
import com.todo.file.service.FilesService;
import com.todo.model.CommandsDB;
import com.todo.utils.ErrorCodes;
import com.todo.utils.StringUtils;
import com.todo.utils.SystemUtils;
import com.todo.yaml.todo.Command;
import com.todo.yaml.todo.CommandConfig;
import com.todo.yaml.todo.FileConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;

public class CommandsService {
    private static Logger LOGGER = LoggerFactory.getLogger(CommandsService.class);
    private TodoConfiguration todoConfiguration;
    private SocketService socketService;
    private FilesService filesService;
    public CommandsService(TodoConfiguration todoConfiguration) {
        this.todoConfiguration = todoConfiguration;
        this.filesService = new FilesService(todoConfiguration);
        socketService = new SocketService(todoConfiguration.getSocketRequestDelimiter());
    }
    public Command getCommandById(String commandId) throws TodoException {
        CommandsDB commandsDB = todoConfiguration.getConfigInterface().getCommandsDB(
                todoConfiguration.getConfigInterface().getAppConfig());
        if (commandId == null) {
            LOGGER.info("commandId is null");
            throw new TodoException(ErrorCodes.COMMAND_ID_NULL);
        }
        if (commandsDB == null) {
            LOGGER.info("commandId: {}, not found and commandsDB is null", commandId);
            throw new TodoException(ErrorCodes.COMMAND_NOT_FOUND);
        }
        ArrayList<Command> commandsList = commandsDB.getCommandList();
        Command command = null;
        if (commandsList == null) {
            LOGGER.info("commandId: {}, not found and commandsList is null", commandId);
            throw new TodoException(ErrorCodes.COMMAND_NOT_FOUND);
        }
        ArrayList<String> commandIdList = new ArrayList<String>();
        for (Command command1: commandsList) {
            commandIdList.add(command1.getId());
            if (commandId.equals(command1.getId())) {
                command = command1;
                break;
            }
        }
        if (command == null) {
            LOGGER.info("commandId: {}, not found in commandsIdList: {}", commandId, commandIdList);
            throw new TodoException(ErrorCodes.COMMAND_NOT_FOUND);
        }
        return command;
    }
    private void generateLog(String type, String dateTimeStr, String commandStr) {
        LOGGER.info("Saving log for type: {}, dateTimeStr: {}, commandStr:{}",
                StringUtils.getLoggerObject(type, dateTimeStr, commandStr));
        CommandConfig commandConfig =
                todoConfiguration.getConfigInterface().getAppConfig().getCommandConfig();
        String requsetDelimiter = todoConfiguration.getSocketRequestDelimiter();
        if (commandConfig != null) {
            try {
                FileConfig fileConfig = commandConfig.getCommandLogRequestFile();
                if (type.equals("response")) {
                    fileConfig = commandConfig.getCommandLogResponseFile();
                }
                if (fileConfig != null) {
                    filesService.addNewLineInDirFilename(
                            type + requsetDelimiter + dateTimeStr + requsetDelimiter + commandStr,
                            fileConfig.getDirectory(), fileConfig.getFileName() + fileConfig.getExtention());
                } else {
                    LOGGER.info("Error in saving {} in log file, fileConfig is null", type);
                }
            } catch (TodoException todoe) {
                LOGGER.info("Error in saving {} in log file", type);
            }
        } else {
            LOGGER.info("Error in saving {} as commandConfig is null", type);
        }
    }
    public Object executeCommandFromCommandId(String commandId, String ip, String port) {
        HashMap<String, String> response = new HashMap<String, String>();
        response.put("commandId", commandId);
        response.put(AppConstant.STATUS, AppConstant.SUCCESS);
        Command command = null;
        try {
            command = getCommandById(commandId);
            LOGGER.info("command found for commandId: {}, command: {}", commandId, command);
        } catch (TodoException todoe) {
            response.put(AppConstant.STATUS, AppConstant.FAILURE);
            response.put(AppConstant.REASON, "command not found");
            LOGGER.info("command not found for commandId: {}", commandId);
        }
        if (command != null && response.get(AppConstant.STATUS).equals(AppConstant.SUCCESS)) {
            if (ip == null) {
                ip = command.getIp();
            }
            if (port == null) {
                port = command.getPort();
            }
            if (ip != null && port != null && command.getCommand() != null) {
                String requsetDelimiter = todoConfiguration.getSocketRequestDelimiter();
                String dateTimeStr = SystemUtils.getFormatedTimeInMsV2();
                String commandStr = "";
                commandStr += ip;
                commandStr += requsetDelimiter + port;
                commandStr += requsetDelimiter + command.getCommand();
                LOGGER.info("command generated:{}, for commandId: {}", commandStr, commandId);
                generateLog("request", dateTimeStr, commandStr);
                String socketResponse = socketService.getSocketResponse(commandStr);
                generateLog("response", dateTimeStr, socketResponse);
                response.put(AppConstant.RESPONSE, socketResponse);
            }
        }
        return response;
    }
}
