package com.todo.resources;

import com.todo.TodoConfiguration;
import com.todo.config.TodoFileConfig;
import com.todo.model.Todo;
import com.todo.model.TodoDatabase;
import com.todo.parser.FileParser;
import com.todo.parser.TodoDbParser;
import com.todo.response.TodoResponse;
import com.todo.services.SocketService;
import com.todo.services.TodoService;
import com.todo.utils.ErrorCodes;
import com.todo.utils.TodoException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by shishupalkumar on 12/01/17.
 */
@Path("/todo/api/v1")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)

public class TodoResource {
    private static Logger logger = LoggerFactory.getLogger(TodoResource.class);
    private TodoFileConfig todoFileConfig;
    private SocketService socketService;
    private Map<String, String> tcpIpConfig;
    @Context
    private HttpServletRequest httpServletRequest;
    public TodoResource (TodoConfiguration todoConfiguration, TodoFileConfig todoFileConfig) {
        this.todoFileConfig = todoFileConfig;
        TodoDbParser todoDbParser = new FileParser();
        TodoDatabase todoDatabase = todoDbParser.getTodoDatabase(todoFileConfig);
        tcpIpConfig = todoConfiguration.getConfigService().getAppConfig().getTcpIpConfig();
        logger.info("Todos : {}", todoDatabase.getTodoMap());
        logger.info("TodoUser : {}", todoDatabase.getTodoUserMap());
        logger.info("TodoEvent : {}", todoDatabase.getTodoEventMap());
        logger.info("TodoComment : {}", todoDatabase.getTodoCommentMap());
        logger.info("TodoUpdate : {}", todoDatabase.getTodoUpdateMap());
        socketService = new SocketService(todoConfiguration.getSocketRequestDelimiter());
    }

    @Path("/all")
    @GET
    public ArrayList<Todo> getAllTodo() {
        logger.info("getAllTodo : In");
        TodoDbParser todoDbParser = new FileParser();
        TodoDatabase todoDatabase = todoDbParser.getTodoDatabase(todoFileConfig);
        TodoService todoService = new TodoService(todoDatabase);
        ArrayList<Todo> todos = todoService.getAllTodo();
        logger.info("getAllTodo : Out : {}", todos);
        return todos;
    }
    @Path("/id/{id}")
    @GET
    public TodoResponse getTodoResponseById(@PathParam("id") String todoId) {
        logger.info("getTodoResponseById : In");
        Integer todoIndex = 0;
        try {
            todoIndex = Integer.parseInt(todoId);
        } catch (NumberFormatException nfe ) {
            logger.error("Invalid Todo Id : {}", todoId);
            throw new NumberFormatException("Invalid Todo Id : " + todoId);
        }
        TodoDbParser todoDbParser = new FileParser();
        TodoDatabase todoDatabase = todoDbParser.getTodoDatabase(todoFileConfig);
        TodoService todoService = new TodoService(todoDatabase);
        TodoResponse todoResponse = todoService.getTodoById(todoIndex.toString());
        logger.info("getTodoResponseById : Out : {}", todoResponse);
        return todoResponse;
    }

    @Path("/socket")
    @GET
    public String getSocketResponse(@QueryParam("query") String query) throws TodoException {
        logger.info("getSocketResponse : In : query : {}", query);
        if (query == null) {
            logger.info("getSocketResponse : throw : TodoException : {}", ErrorCodes.BAD_REQUEST_ERROR);
            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        String response = socketService.getSocketResponse(query);
        logger.info("getSocketResponse : Out : response : {}", response);
        return response;
    }
    @Path("/socket/v2")
    @GET
    public String getSocketResponse(@QueryParam("query") String query, @QueryParam("service") String serviceName) throws TodoException {
        logger.info("getSocketResponse : In : service : {} : query : {}", serviceName, query);
        if (query == null) {
            logger.info("getSocketResponse : throw : TodoException : {}", ErrorCodes.BAD_REQUEST_ERROR);
            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        String response = socketService.getSocketResponseV2(tcpIpConfig, serviceName, query);
        logger.info("getSocketResponse : Out : response : {}", response);
        return response;
    }
}
