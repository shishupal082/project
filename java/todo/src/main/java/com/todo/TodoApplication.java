package com.todo;

import com.todo.common.LoggingHelper;
import com.todo.common.TodoExceptionMapper;
import com.todo.filters.LogFilter;
import com.todo.filters.RequestFilter;
import com.todo.filters.ResponseFilter;
import com.todo.resources.*;
import com.todo.utils.SystemUtils;
import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import io.dropwizard.views.ViewBundle;
import org.eclipse.jetty.server.session.SessionHandler;
import org.glassfish.jersey.media.multipart.MultiPartFeature;

import java.util.ArrayList;

/**
 * Created by shishupalkumar on 25/12/16.
 */

public class TodoApplication extends Application<TodoConfiguration> {
    private static ArrayList<String> appConfigPath;
    public void initialize(Bootstrap<TodoConfiguration> bootstrap) {
        super.initialize(bootstrap);
        bootstrap.addBundle(new ViewBundle<TodoConfiguration>());
        bootstrap.addBundle(new AssetsBundle("/assets/", "/assets"));
    }
    @Override
    public void run(TodoConfiguration todoConfiguration, Environment environment) throws Exception{
        todoConfiguration.getAppConfigPath().addAll(appConfigPath);
        environment.servlets().setSessionHandler(new SessionHandler());
        environment.jersey().register(MultiPartFeature.class);
        environment.jersey().register(new FaviconResource());
        environment.jersey().register(new LogFilter());
        environment.jersey().register(new RequestFilter());
        environment.jersey().register(new ResponseFilter());
        environment.jersey().register(new TodoExceptionMapper());
        environment.jersey().register(new ConfigResource(todoConfiguration));
        environment.jersey().register(new TodoResource(todoConfiguration));
        environment.jersey().register(new FilesResource(todoConfiguration));
        environment.jersey().register(new ViewResource(todoConfiguration));
        environment.jersey().register(new TaskResource(todoConfiguration));
        environment.jersey().register(new ProjectResource(todoConfiguration));

    }
    public static void main(String[] args) throws Exception {
        if (args.length <3) {
            String logStr = "Min 3 parameters required:server, " +
                    "env_config_yml_filepath, env_config_custom_logging_yaml_filepath";
            SystemUtils.printLog(logStr);
            throw new Exception();
        }
        String customLoggingPath = args[2];
        LoggingHelper loggingHelper = new LoggingHelper();
        loggingHelper.doLoggingSetup(customLoggingPath);
        appConfigPath = new ArrayList<String>();
        for (int i=3; i<args.length; i++) {
            appConfigPath.add(args[i]);
        }
        new TodoApplication().run(args[0], args[1]);
    }
}
