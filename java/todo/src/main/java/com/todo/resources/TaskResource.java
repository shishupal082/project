package com.todo.resources;

import com.todo.TodoConfiguration;
import com.todo.task.config.TaskApplications;
import com.todo.task.config.TaskComponent;
import com.todo.task.config.TaskConfig;
import com.todo.task.config.TaskItem;
import com.todo.task.service.TaskService;
import com.todo.utils.ErrorCodes;
import com.todo.utils.TodoException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by shishupalkumar on 17/02/17.
 */
@Path("/task")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TaskResource {
    private static Logger logger = LoggerFactory.getLogger(TaskResource.class);
    @Context
    private HttpServletRequest httpServletRequest;
    private TaskConfig taskConfig;
    private String taskConfigPath;
    private TaskService taskService;
    public TaskResource(TodoConfiguration todoConfiguration, String taskConfigPath) {
        this.taskConfig = TaskService.updateTaskConfig(taskConfigPath);
        taskService = new TaskService(taskConfig);
    }
    @Path("/api/config/v1/update")
    @GET
    public TaskConfig updateTasks() throws TodoException {
        logger.info("updateTasks : In");
        taskConfig = TaskService.updateTaskConfig(taskConfigPath);
        logger.info("updateTasks : Out");
        taskService = new TaskService(taskConfig);
        return taskConfig;
    }
    @Path("/api/config/v1/get")
    @GET
    public TaskConfig getTaskConfig() throws TodoException {
        logger.info("updateTasks : In");
        logger.info("updateTasks : Out");
        return taskConfig;
    }
    @Path("/api/v1/tasks")
    @GET
    public Map<String, TaskItem> getTaskItems() throws TodoException {
        logger.info("getTaskItems : In");
        Map<String, TaskItem> taskItemMap = taskConfig.getTaskItems();
        if (taskItemMap == null) {
            logger.info("taskItemMap is null");
            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        logger.info("getTaskItems : Out");
        return taskItemMap;
    }
    @Path("/api/v1/tasks/{taskId}")
    @GET
    public TaskItem getTaskComponentsById(@PathParam("taskId") String taskId) throws TodoException {
        logger.info("getTaskItems : In");
        TaskItem result = null;
        Map<String, TaskItem> taskItemMap = taskConfig.getTaskItems();
        if (taskItemMap == null) {
            logger.info("taskItemMap is null");
            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        result = taskItemMap.get(taskId);
        if (result == null) {
            logger.info("result is null for taskId : {}", taskId);
            throw new TodoException(ErrorCodes.INVALID_QUERY_PARAMS);
        }
        logger.info("getTaskItems : Out");
        return result;
    }
    @Path("/api/v2/tasks/{taskId}")
    @GET
    public Response getTaskComponentsByIdV2(@PathParam("taskId") String taskId) throws TodoException {
        logger.info("getTaskItems : In");
        ArrayList<String> requiredComponentParams = new ArrayList<String>();
        requiredComponentParams.add("id");
        requiredComponentParams.add("name");
        requiredComponentParams.add("application");
        Object response = taskService.getTaskDetails(taskId, requiredComponentParams);
        logger.info("getTaskItems : Out");
        return Response.ok(response).build();
    }
    @Path("/api/v1/components")
    @GET
    public Map<String, TaskComponent> getTaskComponents() throws TodoException {
        logger.info("getTaskComponents : In");
        Map<String, TaskComponent> result = taskConfig.getTaskComponents();
        if (result == null) {
            logger.info("result is null");
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        logger.info("getTaskComponents : Out");
        return result;
    }
    @Path("/api/v1/components/{id}")
    @GET
    public TaskComponent getTaskComponent(@PathParam("id") String componentId)
        throws TodoException {
        logger.info("getTaskComponent : In");
        Map<String, TaskComponent> taskComponentMap = taskConfig.getTaskComponents();
        if (taskComponentMap == null) {
            logger.info("taskComponentMap is null");
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        TaskComponent taskComponent = taskComponentMap.get(componentId);
        if (taskComponent == null) {
            logger.info("taskComponent is null");
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        logger.info("getTaskComponent : Out");
        return taskComponent;
    }
    @Path("/api/v2/components/{id}")
    @GET
    public Response getTaskComponentDetails(@PathParam("id") String componentId) throws TodoException {
        logger.info("getTaskComponentDetails : In");
        HashMap<String, Object> response = new HashMap<String, Object>();
        Map<String, TaskComponent> taskComponentMap = taskConfig.getTaskComponents();
        if (taskComponentMap == null) {
            logger.info("taskComponentMap is null");
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        TaskComponent taskComponent = taskComponentMap.get(componentId);
        if (taskComponent == null) {
            logger.info("taskComponent is null");
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        response.put("id", componentId);
        response.put("name", taskComponent.getName());
        response.put("taskItem", taskComponent.getTaskItem());
        response.put("taskDetails", taskService.getTaskDetails(taskComponent.getTaskItem(), null));
        logger.info("getTaskComponentDetails : Out");
        return Response.ok(response).build();
    }
    @Path("/api/v3/components/{id}")
    @GET
    public Response getTaskComponentDetailsV3(@PathParam("id") String componentId) throws TodoException {
        logger.info("getTaskComponentDetailsV3 : In");
        Map<String, Object> response = new HashMap<String, Object>();
        Map<String, TaskComponent> taskComponentMap = taskConfig.getTaskComponents();
        if (taskComponentMap == null) {
            logger.info("taskComponentMap is null");
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        TaskComponent taskComponent = taskComponentMap.get(componentId);
        if (taskComponent == null) {
            logger.info("taskComponent is null");
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        response.put("component", taskComponent);
        response.put("application", taskService.getTaskComponentApplication(componentId));
        logger.info("getTaskComponentDetailsV3 : Out");
        return Response.ok(response).build();
    }
    @Path("/api/v1/app")
    @GET
    public TaskApplications getTaskApplications() throws TodoException {
        logger.info("getTaskApplications : In");
        TaskApplications result = taskConfig.getTaskApplications();
        if (result == null) {
            logger.info("result is null");
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        logger.info("getTaskApplications : Out");
        return result;
    }
    @Path("/api/v2/app")
    @GET
    public Map<String, Object> getTaskApplicationsV2() throws TodoException {
        logger.info("getTaskApplications : In");
        Map<String, Object> response = new HashMap<String, Object>();
        TaskApplications taskApplications = taskConfig.getTaskApplications();
        if (taskApplications == null) {
            logger.info("taskApplications is null");
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        Map<String, Map<String, String[][]>> app = taskApplications.getTaskApplications();
        if (app == null) {
            logger.info("app is null");
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        Object object = null;
        ArrayList<String> componentRequiredParams = new ArrayList<String>();
        componentRequiredParams.add("name");
        componentRequiredParams.add("id");
        for (Map.Entry<String, Map<String, String[][]>> entry : app.entrySet()) {
            response.put(entry.getKey(), taskService.getAppDetailsByAppId(entry.getKey(), componentRequiredParams));
        }
        logger.info("getTaskApplications : Out");
        return response;
    }
    @Path("/api/v1/app/{appId}")
    @GET
    public Map<String, String[][]> getTaskApplicationsByAppId(@PathParam("appId") String appId)
            throws TodoException {
        logger.info("getTaskApplicationsByAppId : In");
        TaskApplications taskApplications = taskConfig.getTaskApplications();
        if (taskApplications == null) {
            logger.info("taskApplications is null");
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        Map<String, String[][]> response = taskApplications.getTaskApplications().get(appId);
        if (response == null) {
            logger.info("taskApplicationById is null");
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        logger.info("getTaskApplicationsByAppId : Out");
        return response;
    }
    @Path("/api/v2/app/{appId}")
    @GET
    public Object getTaskApplicationsByAppIdV2(@PathParam("appId") String appId)
            throws TodoException {
        logger.info("getTaskApplicationsByAppId : In");
        Object response = taskService.getAppDetailsByAppId(appId, null);
        if (response == null) {
            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        logger.info("getTaskApplicationsByAppId : Out");
        return response;
    }
}
