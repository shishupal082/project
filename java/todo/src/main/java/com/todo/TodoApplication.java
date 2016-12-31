package com.todo;

import com.todo.model.TodoDatabase;
import com.todo.parser.FileParser;
import com.todo.parser.TodoDbParser;
import com.todo.response.TodoActionResponse;
import com.todo.response.TodoResponse;
import com.todo.services.TodoService;
import org.apache.log4j.PropertyConfigurator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/**
 * Created by shishupalkumar on 25/12/16.
 */

public class TodoApplication {
    private static Logger logger = LoggerFactory.getLogger(TodoApplication.class);
    public static void main(String[] args) throws Exception {
        PropertyConfigurator.configure("log4j.properties");
        TodoDbParser todoDbParser = new FileParser();
        TodoDatabase todoDatabase = todoDbParser.getTodoDatabase();
//        logger.info("Todos : {}", todoDatabase.getTodoMap());
//        logger.info("TodoUser : {}", todoDatabase.getTodoUserMap());
//        logger.info("TodoEvent : {}", todoDatabase.getTodoEventMap());
//        logger.info("TodoComment : {}", todoDatabase.getTodoCommentMap());
//        logger.info("TodoUpdate : {}", todoDatabase.getTodoUpdateMap());
        TodoService todoService = new TodoService(todoDatabase);
        TodoResponse todoResponse = todoService.getTodoById("1");
        logger.info("TodoResponse for todoId={} : {}", 1, todoResponse);
        List<TodoActionResponse> todoActionResponses = todoService.getTodoActionByTodoId("1");
        logger.info("TodoActionResponse for todoId={} : {}", 1, todoActionResponses);
    }
}
