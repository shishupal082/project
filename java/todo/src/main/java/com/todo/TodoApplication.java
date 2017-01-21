package com.todo;

import com.todo.filters.LogFilter;
import com.todo.resources.TodoResource;
import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import io.dropwizard.views.ViewBundle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by shishupalkumar on 25/12/16.
 */

public class TodoApplication extends Application<TodoConfiguration> {
    private static Logger logger = LoggerFactory.getLogger(TodoApplication.class);
    public void initialize(Bootstrap<TodoConfiguration> bootstrap) {
        super.initialize(bootstrap);
        bootstrap.addBundle(new ViewBundle<TodoConfiguration>());
        bootstrap.addBundle(new AssetsBundle("/assets/", "/index", "templates/index.html"));
    }
    @Override
    public void run(TodoConfiguration todoConfiguration, Environment environment) throws Exception{
        environment.jersey().register(new LogFilter());
        environment.jersey().register(new TodoResource(todoConfiguration, todoConfiguration.getTodoFileConfig()));
    }
    public static void main(String[] args) throws Exception {
        new TodoApplication().run(args[0], args[1]);
    }
}