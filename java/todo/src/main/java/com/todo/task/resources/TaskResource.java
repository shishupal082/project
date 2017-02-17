package com.todo.task.resources;

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
@Path("/api/task")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TaskResource {
    private static Logger logger = LoggerFactory.getLogger(TaskResource.class);
    @Context
    private HttpServletRequest httpServletRequest;
    private TaskConfig taskConfig;
    private String taskConfigPath;
    private TaskService taskService;
    public TaskResource(String taskConfigPath) {
        this.taskConfigPath = taskConfigPath;
        this.taskConfig = TaskService.updateTaskConfig(taskConfigPath);
        taskService = new TaskService(taskConfig);
    }
    @Path("/v1/update")
    @GET
    public TaskConfig updateTasks() throws TodoException {
        logger.info("updateTasks : In");
        taskConfig = TaskService.updateTaskConfig(taskConfigPath);
        logger.info("updateTasks : Out");
        return taskConfig;
    }
    @Path("/v1/get")
    @GET
    public TaskConfig getTaskConfig() throws TodoException {
        logger.info("updateTasks : In");
        logger.info("updateTasks : Out");
        return taskConfig;
    }
    @Path("/v1/tasks")
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
    @Path("/v1/tasks/{taskId}")
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
    @Path("/v2/tasks/{taskId}")
    @GET
    public Response getTaskComponentsByIdV2(@PathParam("taskId") String taskId) throws TodoException {
        logger.info("getTaskItems : In");
        ArrayList<String> requiredParams = new ArrayList<String>();
        requiredParams.add("id");
        requiredParams.add("name");
        Object response = taskService.getTaskDetails(taskId, requiredParams);
        logger.info("getTaskItems : Out");
        return Response.ok(response).build();
    }
    @Path("/v1/components")
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
    @Path("/v1/components/{componentId}")
    @GET
    public TaskComponent getTaskComponent(@PathParam("componentId") String componentId)
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
    @Path("/v2/components/{id}")
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
}
