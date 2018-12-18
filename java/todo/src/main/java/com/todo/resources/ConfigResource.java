package com.todo.resources;

import com.todo.TodoConfiguration;
import com.todo.config.AppConfig;
import com.todo.config.ClientDetails;
import com.todo.config.ResourceDetails;
import com.todo.domain.project_static_data.ProjectStaticData;
import com.todo.yaml.todo.YamlObject;
import com.todo.services.ConfigService;
import com.todo.task.config.TaskConfig;
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
        configService.updateTaskConfig();
        configService.updateProjectStaticData(
                configService.getAppConfig().getProjectStaticDataConfigPath());
        configService.updateYamlObjectDBFromFile();
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
        ResourceDetails resourceDetails = configService.getResourceDetails(
            todoConfiguration.getAvailableResourcePath());
        logger.info("getResourceDetails : Out");
        return resourceDetails;
    }
    @Path("/v1/get/app-config")
    @GET
    public AppConfig getAppConfig() throws TodoException {
        logger.info("getAppConfig : in");
        logger.info("getAppConfig : out");
        return configService.getAppConfig();
    }
    @Path("/v1/update/app-config")
    @GET
    public AppConfig updateAppConfig() throws TodoException {
        logger.info("updateAppConfig : in");
        configService.updateAppConfig(todoConfiguration.getAppConfigPath());
        logger.info("updateAppConfig : out : {}");
        return configService.getAppConfig();
    }
    @Path("/v1/get/task")
    @GET
    public TaskConfig getTaskConfig() throws TodoException {
        logger.info("getTaskConfig : in");
        TaskConfig taskConfig = configService.getTaskConfig();
        logger.info("getTaskConfig : out");
        return taskConfig;
    }
    @Path("/v1/update/task")
    @GET
    public TaskConfig updateTasks() throws TodoException {
        logger.info("updateTasks : in");
        configService.updateTaskConfig();
        TaskConfig taskConfig = configService.getTaskConfig();
        logger.info("updateTasks : out");
        return taskConfig;
    }
    @Path("/v1/get/project-static-data")
    @GET
    public ProjectStaticData getProjectStaticData() throws TodoException {
        logger.info("getProjectStaticData : in");
        ProjectStaticData projectStaticData = configService.getProjectStaticData();
        logger.info("getProjectStaticData : out : {}", projectStaticData);
        return projectStaticData;
    }
    @Path("/v1/update/project-static-data")
    @GET
    public ProjectStaticData updateProjectStaticData() throws TodoException {
        logger.info("updateProjectStaticData : in");
        configService.updateProjectStaticData(
                configService.getAppConfig().getProjectStaticDataConfigPath());
        ProjectStaticData projectStaticData = configService.getProjectStaticData();
        logger.info("updateProjectStaticData : out : {}", projectStaticData);
        return projectStaticData;
    }
    @Path("/v1/get/client-details")
    @GET
    public ClientDetails getClientDetails() throws TodoException {
        logger.info("getClientDetails : in");
        ClientDetails clientDetails = new ClientDetails(httpServletRequest);
        logger.info("getClientDetails : out : {}", clientDetails);
        return clientDetails;
    }
}
