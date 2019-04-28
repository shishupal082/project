package com.todo;

import com.google.common.collect.ImmutableList;
import com.todo.common.LoggingHelper;
import com.todo.common.TodoExceptionMapper;
import com.todo.filters.LogFilter;
import com.todo.filters.RequestFilter;
import com.todo.filters.ResponseFilter;
import com.todo.resources.*;
import com.todo.services.ConfigService;
import com.todo.utils.SystemUtils;
import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.logging.AppenderFactory;
import io.dropwizard.logging.FileAppenderFactory;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import io.dropwizard.views.ViewBundle;
import org.eclipse.jetty.server.session.SessionHandler;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;

/**
 * Created by shishupalkumar on 25/12/16.
 */

public class TodoApplication extends Application<TodoConfiguration> {
    private static Logger LOGGER = LoggerFactory.getLogger(TodoApplication.class);
    private static String dataStorage;
    private static ArrayList<String> appConfigPath;
    private static String customLoggingPath;
    private static String exitApplicationText;
    public void initialize(Bootstrap<TodoConfiguration> bootstrap) {
        super.initialize(bootstrap);
        bootstrap.addBundle(new ViewBundle<TodoConfiguration>());
        bootstrap.addBundle(new AssetsBundle("/assets/", "/assets"));
    }
    @Override
    public void run(TodoConfiguration todoConfiguration, Environment environment) throws Exception {
        String currentLogFilename = null;
        LoggingHelper loggingHelper = new LoggingHelper();
        try {
            ImmutableList<AppenderFactory> immutableList = todoConfiguration.getLoggingFactory().getAppenders().asList();
            FileAppenderFactory fileAppenderFactory = (FileAppenderFactory) immutableList.get(1);
            currentLogFilename = fileAppenderFactory.getCurrentLogFilename();
        } catch (Exception e) {
            LOGGER.info("unable to get currentLogFileName from env_config.yml: {}", e);
        }
        if (currentLogFilename != null && !loggingHelper.isValidLoggingSetup(customLoggingPath, currentLogFilename)) {
            LOGGER.info("customLoggingPath and currentLogFilename are not equal.");
            SystemUtils.printLog(exitApplicationText);
            throw new Exception();
        }
        ConfigService.verifyAppConstantVersion("pom.xml");
        todoConfiguration.getAppConfigPath().addAll(appConfigPath);
        todoConfiguration.setDataStorage(dataStorage);
        environment.servlets().setSessionHandler(new SessionHandler());
        environment.jersey().register(MultiPartFeature.class);
        environment.jersey().register(new FaviconResource());
        environment.jersey().register(new LogFilter());
        environment.jersey().register(new RequestFilter());
        environment.jersey().register(new ResponseFilter());
        environment.jersey().register(new TodoExceptionMapper());
        environment.jersey().register(new ConfigResource(todoConfiguration));
        environment.jersey().register(new CommandsResource(todoConfiguration));
        environment.jersey().register(new TodoResource(todoConfiguration));
        environment.jersey().register(new FilesResource(todoConfiguration));
        environment.jersey().register(new ViewResource(todoConfiguration));
        environment.jersey().register(new TaskResource(todoConfiguration));
        environment.jersey().register(new ProjectResource(todoConfiguration));
    }
    public static void main(String[] args) throws Exception {
        exitApplicationText = "********* Exiting Application *********";
        if (args.length <4) {
            String logStr = "Min 4 parameters required:server, storage, " +
                    "env_config_yml_filepath, env_config_custom_logging_yaml_filepath";
            SystemUtils.printLog(logStr);
            SystemUtils.printLog(exitApplicationText);
            throw new Exception();
        }
        dataStorage = args[1];//ram, file, db, ...
        customLoggingPath = args[3];
        LoggingHelper loggingHelper = new LoggingHelper();
        if (!loggingHelper.doLoggingSetup(customLoggingPath)) {
            SystemUtils.printLog("Error in Log setup.");
            SystemUtils.printLog(exitApplicationText);
            throw new Exception();
        }
        appConfigPath = new ArrayList<String>();
        for (int i=4; i<args.length; i++) {
            appConfigPath.add(args[i]);
        }
        new TodoApplication().run(args[0], args[2]);
    }
}
