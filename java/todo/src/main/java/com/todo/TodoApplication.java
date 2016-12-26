package com.todo;

import org.apache.log4j.PropertyConfigurator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
/**
 * Created by shishupalkumar on 25/12/16.
 */

public class TodoApplication {
    private static Logger logger = LoggerFactory.getLogger(TodoApplication.class);;
    public static void main(String[] args) throws Exception {
        PropertyConfigurator.configure("log4j.properties");
        logger.info("Hello World");
    }
}
