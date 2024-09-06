package com.project.mvc;

import com.project.mvc.controller.ApiResource;
import com.project.mvc.service.RequestService;
import io.dropwizard.Application;
import io.dropwizard.setup.Environment;

public class MVCApplication extends Application<MVCConfiguration> {

    @Override
    public void run(MVCConfiguration ftpConfiguration, Environment environment) {
        environment.jersey().register(new ApiResource(new RequestService()));
    }

    public static void main(String[] args) throws Exception {
        new MVCApplication().run(args);
    }
}
