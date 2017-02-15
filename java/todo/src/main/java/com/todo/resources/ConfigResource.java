package com.todo.resources;

import com.todo.TodoConfiguration;
import com.todo.config.DirectoryConfig;
import com.todo.services.ConfigService;
import com.todo.utils.TodoException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

/**
 * Created by shishupalkumar on 14/02/17.
 */
@Path("/api/config/v1")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ConfigResource {
    private static Logger logger = LoggerFactory.getLogger(ConfigResource.class);
    @Context
    private HttpServletRequest httpServletRequest;
    private ConfigService configService;
    private TodoConfiguration todoConfiguration;
    public ConfigResource(TodoConfiguration todoConfiguration) {
        configService = new ConfigService(todoConfiguration);
        this.todoConfiguration = todoConfiguration;
    }
    @Path("/get/directory_config")
    @GET
    public DirectoryConfig getDirectoryConfig() throws TodoException {
        logger.info("getDirectoryConfig : In");
        DirectoryConfig directoryConfig = todoConfiguration.getDirectoryConfig();
        if (directoryConfig == null) {
            directoryConfig = new DirectoryConfig();
        }
        logger.info("getDirectoryConfig : Out : {}", directoryConfig);
        return directoryConfig;
    }
    @Path("/update/directory_config")
    @GET
    public DirectoryConfig updateDirectoryConfig() {
        logger.info("updateDirectoryConfig : In");
        DirectoryConfig directoryConfig = configService.updateDirectoryConfig();
        logger.info("updateDirectoryConfig : Out : {}", directoryConfig);
        return directoryConfig;
    }
}
