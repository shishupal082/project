package com.project;

import com.project.controller.EmployeeRESTController;
import com.project.controller.UserRESTController;
import com.project.dao.DbDAO;
import com.project.representations.Employee;
import com.project.representations.MysqlUser;
import io.dropwizard.Application;
import io.dropwizard.db.DataSourceFactory;
import io.dropwizard.hibernate.HibernateBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class App extends Application<AppConfiguration> {
    private static final Logger logger = LoggerFactory.getLogger(App.class);
    private final HibernateBundle<AppConfiguration> hibernateBundle
            = new HibernateBundle<AppConfiguration>(
            Employee.class, MysqlUser.class
    ) {
        @Override
        public DataSourceFactory getDataSourceFactory(
                AppConfiguration configuration
        ) {
            return configuration.getDataSourceFactory();
        }
    };


    @Override
    public void initialize(Bootstrap<AppConfiguration> bootstrap) {
        bootstrap.addBundle(hibernateBundle);
    }

    @Override
    public void run(AppConfiguration appConfiguration, Environment environment) throws Exception {
        logger.info("Registering REST resources");

        final DbDAO dbDAO = new DbDAO(hibernateBundle.getSessionFactory());
        environment.jersey().register(new EmployeeRESTController(dbDAO));
        environment.jersey().register(new UserRESTController(dbDAO));
    }

    public static void main(String[] args) throws Exception {
        new App().run(args);
    }
}
