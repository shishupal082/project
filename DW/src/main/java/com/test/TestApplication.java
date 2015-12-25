package com.test;

import com.test.resources.HomeResources;
import com.test.resources.TestResources;
import com.test.resources.ViewResources;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;

/**
 * Created by shishupal.kumar on 19/12/15.
 */

public class TestApplication extends BaseApplication<TestConfiguration> {
    public void initialize(Bootstrap<TestConfiguration> bootstrap) {
        bootstrap.addBundle(new AssetsBundle("/assets/", "/", "templates/index.html"));
    }
    @Override
    public void run(TestConfiguration testConfiguration, Environment environment) throws Exception{
        environment.jersey().register(new TestResources(testConfiguration.getTestConfig()));
        environment.jersey().register(new HomeResources());
        environment.jersey().register(new ViewResources());
    }
    public static void main(String[] args) throws Exception {
        new TestApplication().run(args[0], args[1]);
    }
}
