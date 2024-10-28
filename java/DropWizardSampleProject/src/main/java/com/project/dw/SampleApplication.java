package com.project.dw;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.project.dw.controller.SampleController;
import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import io.dropwizard.views.ViewBundle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@JsonIgnoreProperties(ignoreUnknown = true)

public class SampleApplication extends Application<SampleConfiguration> {

    final static Logger logger = LoggerFactory.getLogger(SampleApplication.class);
    @Override
    public void initialize(Bootstrap<SampleConfiguration> bootstrap) {
        super.initialize(bootstrap);
        bootstrap.addBundle(new ViewBundle<>());
        bootstrap.addBundle(new AssetsBundle("/assets/", "/assets"));
    }
    @Override
    public void run(SampleConfiguration sampleConfiguration, Environment environment) {
        logger.info("Application run success.");
        environment.jersey().register(new SampleController(sampleConfiguration));
    }

    public static void main(String[] args) throws Exception {
        new SampleApplication().run(args);
    }
}
