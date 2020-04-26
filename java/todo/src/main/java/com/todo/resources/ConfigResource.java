package com.todo.resources;

import com.todo.TodoConfiguration;
import com.todo.common.TodoException;
import com.todo.config.ClientDetails;
import com.todo.domain.project_static_data.ProjectStaticData;
import com.todo.interfaces.ConfigImplementsFile;
import com.todo.interfaces.ConfigImplementsRAM;
import com.todo.interfaces.ConfigInterface;
import com.todo.model.TaskConfigDB;
import com.todo.services.ConfigService;
import com.todo.utils.ErrorCodes;
import com.todo.yaml.todo.AppConfig;
import com.todo.yaml.todo.ResourceDetails;
import com.todo.yaml.todo.YamlObject;
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
//    private ConfigService configService;
    private ConfigInterface configInterface;
    public ConfigResource(TodoConfiguration todoConfiguration) throws TodoException {
        this.todoConfiguration = todoConfiguration;
//        configService = new ConfigService(todoConfiguration);
//        this.todoConfiguration.setConfigService(configService);
//        configService.updateAppConfig(todoConfiguration.getAppConfigPath());
//        configService.updateTaskConfig();
//        configService.updateProjectStaticData(
//                configService.getAppConfig().getProjectStaticDataConfigPath());
//        configService.updateYamlObjectDBFromFile();
//        try {
//            configService.updateCommandsDBFromFilePath();
//        } catch (TodoException todoe) {
//            logger.info("Error in updating commands: {}", todoe);
//        }
        //ConfigInterfacing
        if (todoConfiguration.getDataStorage().equals("ram")) {
            configInterface = new ConfigImplementsRAM(todoConfiguration);
        } else if(todoConfiguration.getDataStorage().equals("file")) {
            configInterface = new ConfigImplementsFile(todoConfiguration);
        } else {
            throw new TodoException(ErrorCodes.CONFIG_ERROR_INVALID_STORAGE_TYPE);
        }
        this.todoConfiguration.setConfigInterface(configInterface);
    }
    @Path("/v1/yaml")
    @GET
    public YamlObject getYamlObject() throws TodoException {
        logger.info("getYamlObject : In");
        YamlObject yamlObject = ConfigService.getYamlObject(todoConfiguration.getYamlObjectPath());
        logger.info("getYamlFileName : Out");
        return yamlObject;
    }
    @Path("/v1/resource")
    @GET
    public ResourceDetails getResourceDetials() throws TodoException {
        logger.info("getResourceDetails : In");
        ResourceDetails resourceDetails = ConfigService.getResourceDetails(
            todoConfiguration.getAvailableResourcePath());
        logger.info("getResourceDetails : Out");
        return resourceDetails;
    }
    @Path("/v1/get/app-config")
    @GET
    public AppConfig getAppConfig() throws TodoException {
        logger.info("getAppConfig : in");
        logger.info("getAppConfig : out");
        return configInterface.getAppConfig();
    }
    @Path("/v1/update/app-config")
    @GET
    public AppConfig updateAppConfig() throws TodoException {
        logger.info("updateAppConfig : in");
        AppConfig appConfig = configInterface.updateAppConfig();
        logger.info("updateAppConfig : out");
        return appConfig;
    }
    @Path("/v1/get/task")
    @GET
    public TaskConfigDB getTaskConfig() throws TodoException {
        logger.info("getTaskConfigDB : in");
        TaskConfigDB taskConfigDB = configInterface.getTaskConfigDB(configInterface.getAppConfig());
        logger.info("getTaskConfigDB : out");
        return taskConfigDB;
    }
    @Path("/v1/update/task")
    @GET
    public TaskConfigDB updateTasks() throws TodoException {
        logger.info("updateTasks : in");
        TaskConfigDB taskConfigDB = configInterface.updateTaskConfigDB(configInterface.getAppConfig());
        logger.info("updateTasks : out");
        return taskConfigDB;
    }
    @Path("/v1/get/project-static-data")
    @GET
    public ProjectStaticData getProjectStaticData() throws TodoException {
        logger.info("getProjectStaticData : in");
        ProjectStaticData projectStaticData = configInterface.getProjectStaticData(configInterface.getAppConfig());
        logger.info("getProjectStaticData : out : {}", projectStaticData);
        return projectStaticData;
    }
    @Path("/v1/update/project-static-data")
    @GET
    public ProjectStaticData updateProjectStaticData() throws TodoException {
        logger.info("updateProjectStaticData : in");
        ProjectStaticData projectStaticData = configInterface.updateProjectStaticData(configInterface.getAppConfig());
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
