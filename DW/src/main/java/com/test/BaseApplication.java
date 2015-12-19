package com.test;

/**
 * Created by shishupal.kumar on 19/12/15.
 */
import io.dropwizard.Application;
import io.dropwizard.Configuration;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;

public abstract class BaseApplication<T extends Configuration> extends Application<T> {

    public BaseApplication() {
    }

    public void initialize(Bootstrap<T> bootstrap) {
    }

    public void run(T configuration, Environment environment) throws Exception {
    }
}
