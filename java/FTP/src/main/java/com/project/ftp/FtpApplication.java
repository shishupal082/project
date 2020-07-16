package com.project.ftp;

import com.project.ftp.config.AppConstant;
import com.project.ftp.config.AppConfig;
import com.project.ftp.filters.LogFilter;
import com.project.ftp.filters.RequestFilter;
import com.project.ftp.filters.ResponseFilter;
import com.project.ftp.resources.ApiResource;
import com.project.ftp.resources.AppResource;
import com.project.ftp.resources.FaviconResource;
import com.project.ftp.service.ConfigService;
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
import java.util.Arrays;

public class FtpApplication  extends Application<FtpConfiguration> {
    final static Logger LOGGER = LoggerFactory.getLogger(FtpApplication.class);
    final static ArrayList<String> arguments = new ArrayList<String>();
    public void initialize(Bootstrap<FtpConfiguration> bootstrap) {
        super.initialize(bootstrap);
        bootstrap.addBundle(new ViewBundle<FtpConfiguration>());
        bootstrap.addBundle(new AssetsBundle("/assets/", "/assets"));
    }
    @Override
    public void run(FtpConfiguration ftpConfiguration, Environment environment) throws Exception {
        LOGGER.info("commandLineArguments: " + arguments.toString());
        AppConfig appConfig = new AppConfig();
        appConfig.setFtpConfiguration(ftpConfiguration);
        ConfigService.init(appConfig);
        LOGGER.info("appConfig: {}", appConfig);
        environment.servlets().setSessionHandler(new SessionHandler());
        environment.jersey().register(MultiPartFeature.class);
        environment.jersey().register(new LogFilter());
        environment.jersey().register(new RequestFilter(appConfig));
        environment.jersey().register(new ResponseFilter());
        environment.jersey().register(new FaviconResource(appConfig));
        environment.jersey().register(new ApiResource(appConfig));
        environment.jersey().register(new AppResource(appConfig));
//        environment.jersey().register(new ViewResource(yardConfiguration));
    }
    public static void main(String[] args) throws Exception {
        arguments.addAll(Arrays.asList(args));
        new FtpApplication().run(AppConstant.server, args[0]);
    }
}
