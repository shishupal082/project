package com.test;

import com.test.common.TestExceptionMapper;
import com.test.filter.RequestFilter;
import com.test.resources.DataResource;
import com.test.resources.TestResources;

import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;

/**
 * Created by shishupal.kumar on 19/12/15.
 */

public class TestApplication extends Application<TestConfiguration> {
    public void initialize(Bootstrap<TestConfiguration> bootstrap) {
        bootstrap.addBundle(new AssetsBundle("/assets/", "/", "templates/index.html"));
    }
    @Override
    public void run(TestConfiguration testConfiguration, Environment environment) throws Exception{
        RequestFilter requestFilter = new RequestFilter();
        environment.jersey().register(new TestExceptionMapper());
        environment.jersey().register(requestFilter);
        environment.jersey().register(new TestResources(testConfiguration.getTestConfig()));
        environment.jersey().register(new DataResource(requestFilter));
    }
    public static void main(String[] args) throws Exception {
        new TestApplication().run(args[0], args[1]);
    }
}
