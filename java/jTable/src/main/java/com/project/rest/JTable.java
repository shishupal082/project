package com.project.rest;

import com.project.rest.controller.EmployeeRESTController;
import com.project.rest.dao.EmployeeDB;
import com.project.rest.filters.ResponseFilter;
import com.project.rest.service.EmployeeService;
import io.dropwizard.Application;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class JTable extends Application<JTableConfiguration> {
    private static final Logger LOGGER = LoggerFactory.getLogger(JTable.class);
    @Override
    public void initialize(Bootstrap<JTableConfiguration> bootstrap) {
        super.initialize(bootstrap);
    }
    @Override
    public void run(JTableConfiguration c, Environment e) throws Exception {
        LOGGER.info("Registering REST resources");
        EmployeeDB employeeDB = new EmployeeDB();
        EmployeeService employeeService = new EmployeeService(employeeDB);
        e.jersey().register(new ResponseFilter());
        e.jersey().register(new EmployeeRESTController(e.getValidator(), employeeService));
    }
    public static void main(String[] args) throws Exception {
        new JTable().run(args);
    }
}
