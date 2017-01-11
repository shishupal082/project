package com.todo;

import com.todo.model.TodoDatabase;
import com.todo.parser.FileParser;
import com.todo.parser.TodoDbParser;
import com.todo.response.TodoActionResponse;
import com.todo.response.TodoResponse;
import com.todo.services.TodoService;
import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;

import java.util.List;

/**
 * Created by shishupalkumar on 25/12/16.
 */

public class TodoApplication extends Application<TodoConfiguration> {
//    private static Logger logger = LoggerFactory.getLogger(TodoApplication.class);
    public void initialize(Bootstrap<TodoConfiguration> bootstrap) {
//        bootstrap.addBundle(new AssetsBundle("/assets/", "/", "templates/index.html"));
    }
    @Override
    public void run(TodoConfiguration todoConfiguration, Environment environment) throws Exception{
        TodoDbParser todoDbParser = new FileParser();
        TodoDatabase todoDatabase = todoDbParser.getTodoDatabase();
//        logger.info("Todos : {}", todoDatabase.getTodoMap());
//        logger.info("TodoUser : {}", todoDatabase.getTodoUserMap());
//        logger.info("TodoEvent : {}", todoDatabase.getTodoEventMap());
//        logger.info("TodoComment : {}", todoDatabase.getTodoCommentMap());
//        logger.info("TodoUpdate : {}", todoDatabase.getTodoUpdateMap());
        TodoService todoService = new TodoService(todoDatabase);
        TodoResponse todoResponse = todoService.getTodoById("1");
//        logger.info("TodoResponse for todoId={} : {}", 1, todoResponse);
        List<TodoActionResponse> todoActionResponses = todoService.getTodoActionByTodoId("1");
//        logger.info("TodoActionResponse for todoId={} : {}", 1, todoActionResponses);
//        RequestFilter requestFilter = new RequestFilter();
//        environment.jersey().register(new TestExceptionMapper());
//        environment.jersey().register(requestFilter);
//        environment.jersey().register(new TestResources(testConfiguration.getTestConfig()));
//        environment.jersey().register(new HomeResources());
//        environment.jersey().register(new ViewResources());
//        environment.jersey().register(new DataResource(requestFilter));
    }
    public static void main(String[] args) throws Exception {
        new TodoApplication().run(args[0], args[1]);
    }
}
