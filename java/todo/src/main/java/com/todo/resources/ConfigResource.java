package com.todo.resources;

import com.todo.TodoConfiguration;
import com.todo.config.ResourceDetails;
import com.todo.file.config.FilesConfig;
import com.todo.model.YamlObject;
import com.todo.services.ConfigService;
import com.todo.task.config.TaskConfig;
import com.todo.utils.TodoException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

/**
 * Created by shishupalkumar on 14/02/17.
 */
@Path("/config/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ConfigResource {
    private static Logger logger = LoggerFactory.getLogger(ConfigResource.class);
    @Context
    private HttpServletRequest httpServletRequest;
    private TodoConfiguration todoConfiguration;
    private ConfigService configService;
    public ConfigResource(TodoConfiguration todoConfiguration) {
        this.todoConfiguration = todoConfiguration;
        configService = new ConfigService(todoConfiguration);
        this.todoConfiguration.setConfigService(configService);
        configService.updateAppConfig(todoConfiguration.getAppConfigPath());
    }
    @Path("/v1/yaml")
    @GET
    public YamlObject getYamlObject() throws TodoException {
        logger.info("getYamlObject : In");
        YamlObject yamlObject = configService.getYamlObject();
        logger.info("getYamlFileName : Out");
        return yamlObject;
    }
    @Path("/v1/resource")
    @GET
    public ResourceDetails getResourceDetials() throws TodoException {
        logger.info("getResourceDetails : In");
        ResourceDetails resourceDetails = configService.getResourceDetails();
        logger.info("getResourceDetails : Out");
        return resourceDetails;
    }
    @Path("/v1/update/task")
    @GET
    public TaskConfig updateTasks() throws TodoException {
        logger.info("updateTasks : in");
        configService.updateTaskConfig(configService.getAppConfig(), todoConfiguration.getAppConfigPath());
        TaskConfig taskConfig = configService.getTaskConfig();
        logger.info("updateTasks : out");
        return taskConfig;
    }
    @Path("/v1/get/task")
    @GET
    public TaskConfig getTaskConfig() throws TodoException {
        logger.info("getTaskConfig : in");
        TaskConfig taskConfig = configService.getTaskConfig();
        logger.info("getTaskConfig : out");
        return taskConfig;
    }
    @Path("/v1/update/files")
    @GET
    public FilesConfig updateFilesConfig() throws TodoException {
        logger.info("updateFilesConfig : in");
        configService.updateFilesConfig(configService.getAppConfig(), todoConfiguration.getAppConfigPath());
        FilesConfig filesConfig = configService.getFileConfig();
        logger.info("updateFilesConfig : out");
        return filesConfig;
    }
    @Path("/v1/get/files")
    @GET
    public FilesConfig getFileConfig() throws TodoException {
        logger.info("getFileConfig : in");
        FilesConfig filesConfig = configService.getFileConfig();
        logger.info("getFileConfig : out");
        return filesConfig;
    }
}
