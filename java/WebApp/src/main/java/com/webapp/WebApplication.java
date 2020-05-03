package com.webapp;

import com.webapp.config.AppConfig;
import com.webapp.config.WebAppConfig;
import com.webapp.constants.AppConstant;
import com.webapp.filters.LogFilter;
import com.webapp.filters.RequestFilter;
import com.webapp.filters.ResponseFilter;
import com.webapp.resources.AppResource;
import com.webapp.resources.FaviconResource;
import com.webapp.service.ConfigService;
import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import io.dropwizard.views.ViewBundle;
import org.eclipse.jetty.server.session.SessionHandler;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;

public class WebApplication  extends Application<WebAppConfiguration> {
    private static Logger LOGGER = LoggerFactory.getLogger(WebApplication.class);
    private static ArrayList<String> arguments = new ArrayList<String>();
    public void initialize(Bootstrap<WebAppConfiguration> bootstrap) {
        super.initialize(bootstrap);
        bootstrap.addBundle(new ViewBundle<WebAppConfiguration>());
        bootstrap.addBundle(new AssetsBundle("/assets/", "/assets"));
    }
    @Override
    public void run(WebAppConfiguration webAppConfiguration, Environment environment) throws Exception {
        LOGGER.info("commandLineArguments: " + arguments.toString());
        WebAppConfig webAppConfig = new WebAppConfig(webAppConfiguration);
        webAppConfig.setAppConfig(new AppConfig());
        ConfigService.init(webAppConfig);
        LOGGER.info("WebAppConfig: {}", webAppConfig);
        environment.servlets().setSessionHandler(new SessionHandler());
        environment.jersey().register(MultiPartFeature.class);
        environment.jersey().register(new LogFilter());
        environment.jersey().register(new RequestFilter(webAppConfig));
        environment.jersey().register(new ResponseFilter());
        environment.jersey().register(new FaviconResource(webAppConfig));
        environment.jersey().register(new AppResource(webAppConfig));
//        environment.jersey().register(new ViewResource(yardConfiguration));
    }
    public static void main(String[] args) throws Exception {
        for (int i=0; i<args.length; i++) {
            arguments.add(args[i]);
        }
        new WebApplication().run(AppConstant.server, args[0]);
    }
}
