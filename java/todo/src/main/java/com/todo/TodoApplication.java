package com.todo;

import com.todo.model.TodoDatabase;
import com.todo.parser.FileParser;
import com.todo.parser.TodoDbParser;
import org.apache.log4j.PropertyConfigurator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
/**
 * Created by shishupalkumar on 25/12/16.
 */

public class TodoApplication {
    private static Logger logger = LoggerFactory.getLogger(TodoApplication.class);;
    public static void main(String[] args) throws Exception {
        PropertyConfigurator.configure("log4j.properties");
        TodoDbParser todoDbParser = new FileParser();
        TodoDatabase todoDatabase = todoDbParser.getTodoDatabase();
        logger.info("Todos : {}", todoDatabase.getTodoMap());
        logger.info("TodoUser : {}", todoDatabase.getTodoUserMap());
        logger.info("TodoEvent : {}", todoDatabase.getTodoEventMap());
        logger.info("TodoComment : {}", todoDatabase.getTodoCommentMap());
        logger.info("TodoUpdate : {}", todoDatabase.getTodoUpdateMap());
    }
}
