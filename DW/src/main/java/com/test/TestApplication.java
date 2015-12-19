package com.test;

import com.test.resources.TestResources;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;

/**
 * Created by shishupal.kumar on 19/12/15.
 */

public class TestApplication extends BaseApplication<TestConfiguration> {
    public void initialize(Bootstrap<TestConfiguration> bootstrap) {
        bootstrap.addBundle(new AssetsBundle("/templates/", "/", "index.html"));
    }
    @Override
    public void run(TestConfiguration testConfiguration, Environment environment) throws Exception{
        environment.jersey().register(new TestResources(testConfiguration.getTestConfig()));
    }
    public static void main(String[] args) throws Exception {
        new TestApplication().run(args[0], args[1]);
    }
}
