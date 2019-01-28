package com.todo.resources;

import com.todo.TodoConfiguration;
import com.todo.common.TodoException;
import com.todo.model.CommandsDB;
import com.todo.services.CommandsService;
import com.todo.utils.StringUtils;
import com.todo.yaml.todo.Command;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;

@Path("/commands/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CommandsResource {
    private static Logger logger = LoggerFactory.getLogger(CommandsResource.class);
    @Context
    private HttpServletRequest httpServletRequest;
    private TodoConfiguration todoConfiguration;
    private CommandsService commandsService;
    public CommandsResource(TodoConfiguration todoConfiguration) {
        this.todoConfiguration = todoConfiguration;
        this.commandsService = new CommandsService(todoConfiguration);
    }
    @Path("/get/all")
    @GET
    public ArrayList<Command> getCommandsDB() throws TodoException {
        logger.info("getCommandsDB : In");
        ArrayList<Command> commandArrayList = new ArrayList<Command>();
        CommandsDB commandsDB = todoConfiguration.getConfigService().getCommandsDB();
        if (commandsDB != null && commandsDB.getCommandList() != null) {
            commandArrayList = commandsDB.getCommandList();
        }
        logger.info("getCommandsDB : Out");
        return commandArrayList;
    }
    @Path("/get/id/{commandId}")
    @GET
    public ArrayList<Command> getCommandById(@PathParam("commandId") String commandId) throws TodoException {
        logger.info("getCommandById id: {}", commandId);
        ArrayList<Command> commandArrayList = new ArrayList<Command>();
        Command command = commandsService.getCommandById(commandId);
        commandArrayList.add(command);
        logger.info("getCommandById : Out");
        return commandArrayList;
    }
    @Path("/update")
    @GET
    public ArrayList<Command> updateCommandsDB() throws TodoException {
        logger.info("updateCommandsDB : In");
        todoConfiguration.getConfigService().updateCommandsDBFromFilePath();
        ArrayList<Command> commandArrayList = new ArrayList<Command>();
        CommandsDB commandsDB = todoConfiguration.getConfigService().getCommandsDB();
        if (commandsDB != null && commandsDB.getCommandList() != null) {
            commandArrayList = commandsDB.getCommandList();
        }
        logger.info("updateCommandsDB : Out");
        return commandArrayList;
    }
    @Path("/execute/id/{commandId}")
    @GET
    public Object executeCommandFromCommandId(@PathParam("commandId") String commandId,
                                              @QueryParam("ip") String ip,
                                              @QueryParam("port") String port) throws TodoException {
        logger.info("executeCommandFromCommandId : In, commandId: {}, ip: {}, port: {}", StringUtils.getLoggerObject(commandId, ip, port));
        Object executeResponse = commandsService.executeCommandFromCommandId(commandId, ip, port);
        logger.info("executeCommandFromCommandId : Out, response: {}", executeResponse);
        return executeResponse;
    }
}

