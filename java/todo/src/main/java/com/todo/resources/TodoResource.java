package com.todo.resources;

import com.todo.TodoConfiguration;
import com.todo.config.TodoFileConfig;
import com.todo.model.TodoDatabase;
import com.todo.parser.FileParser;
import com.todo.parser.TodoDbParser;
import com.todo.response.TodoResponse;
import com.todo.services.TodoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

/**
 * Created by shishupalkumar on 12/01/17.
 */
@Path("/api/todo/v1")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)

public class TodoResource {
    private static Logger logger = LoggerFactory.getLogger(TodoResource.class);
    private TodoFileConfig todoFileConfig;
    public TodoResource (TodoConfiguration todoConfiguration, TodoFileConfig todoFileConfig) {
        this.todoFileConfig = todoFileConfig;
        TodoDbParser todoDbParser = new FileParser();
        TodoDatabase todoDatabase = todoDbParser.getTodoDatabase(todoFileConfig);
        logger.info("Todos : {}", todoDatabase.getTodoMap());
        logger.info("TodoUser : {}", todoDatabase.getTodoUserMap());
        logger.info("TodoEvent : {}", todoDatabase.getTodoEventMap());
        logger.info("TodoComment : {}", todoDatabase.getTodoCommentMap());
        logger.info("TodoUpdate : {}", todoDatabase.getTodoUpdateMap());
    }

    @Path("/get")
    @GET
    public TodoResponse getTodoResponseById(@QueryParam("id") String todoId) {
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
}