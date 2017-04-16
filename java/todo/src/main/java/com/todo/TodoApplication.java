package com.todo;

import com.todo.filters.LogFilter;
import com.todo.filters.RequestFilter;
import com.todo.filters.ResponseFilter;
import com.todo.resources.*;
import com.todo.common.TodoExceptionMapper;
import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import io.dropwizard.views.ViewBundle;

/**
 * Created by shishupalkumar on 25/12/16.
 */

public class TodoApplication extends Application<TodoConfiguration> {
    public void initialize(Bootstrap<TodoConfiguration> bootstrap) {
        super.initialize(bootstrap);
        bootstrap.addBundle(new ViewBundle<TodoConfiguration>());
        bootstrap.addBundle(new AssetsBundle("/assets/", "/assets"));
    }
    @Override
    public void run(TodoConfiguration todoConfiguration, Environment environment) throws Exception{
        environment.jersey().register(new FaviconResource());
        environment.jersey().register(new LogFilter());
        environment.jersey().register(new RequestFilter());
        environment.jersey().register(new ResponseFilter());
        environment.jersey().register(new TodoExceptionMapper());
        environment.jersey().register(new TodoResource(todoConfiguration, todoConfiguration.getTodoFileConfig()));
        environment.jersey().register(new FilesResource(todoConfiguration,
            todoConfiguration.getTodoDirectoryConfigPath()));
        environment.jersey().register(new ViewResource(todoConfiguration,
            todoConfiguration.getTodoViewConfig()));
        environment.jersey().register(new ConfigResource(todoConfiguration));
        environment.jersey().register(new TaskResource(todoConfiguration.getTaskConfigPath()));

    }
    public static void main(String[] args) throws Exception {
        new TodoApplication().run(args[0], args[1]);
    }
}
