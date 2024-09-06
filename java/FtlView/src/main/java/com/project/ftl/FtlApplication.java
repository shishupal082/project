package com.project.ftl;

import com.project.ftl.controller.FtlConfiguration;
import io.dropwizard.Application;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import io.dropwizard.views.ViewBundle;

public class FtlApplication extends Application<FtlConfiguration> {
    @Override
    public void initialize(Bootstrap<FtlConfiguration> bootstrap) {
        super.initialize(bootstrap);
        bootstrap.addBundle(new ViewBundle<>());
    }
    @Override
    public void run(FtlConfiguration ftlConfiguration, Environment environment) {
        environment.jersey().register(new FtlController());
    }

    public static void main(String[] args) throws Exception {
        new FtlApplication().run(args);
    }
}
