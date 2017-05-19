package com.todo.resources;

import com.todo.TodoConfiguration;
import com.todo.task.TaskComponentParams;
import com.todo.task.config.*;
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
    private TaskService taskService;
    private TodoConfiguration todoConfiguration;
    public TaskResource(TodoConfiguration todoConfiguration) {
        this.todoConfiguration = todoConfiguration;
        this.taskService = new TaskService(todoConfiguration);
    }
    @Path("/api/v1/tasks")
    @GET
    public ArrayList<TaskItem> getTaskItems() throws TodoException {
        logger.info("getTaskItems : In");
        ArrayList<TaskItem> taskItems = todoConfiguration.getConfigService().getTaskConfig().getTaskItems();
        if (taskItems == null) {
            logger.info("taskItemMap is null");
            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        logger.info("getTaskItems : Out");
        return taskItems;
    }
    @Path("/api/v2/tasks")
    @GET
    public Response getTaskItemsV2() throws TodoException {
        logger.info("getTaskItems : In");
        ArrayList<HashMap<String, Object>> response = new ArrayList<HashMap<String, Object>>();
        ArrayList<TaskItem> taskItems = todoConfiguration.getConfigService().getTaskConfig().getTaskItems();
        if (taskItems == null) {
            logger.info("taskItemMap is null");
            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        for (TaskItem taskItem : taskItems) {
            response.add(taskService.getTaskDetailsByIdV2(taskItem.getId()));
        }
        logger.info("getTaskItems : Out");
        return Response.ok(response).build();
    }
    @Path("/api/v1/tasks/{taskId}")
    @GET
    public TaskItem getTaskComponentsById(@PathParam("taskId") String taskId) throws TodoException {
        logger.info("getTaskItems : In");
        TaskItem result = null;
        ArrayList<TaskItem> taskItems = todoConfiguration.getConfigService().getTaskConfig().getTaskItems();
        if (taskItems == null) {
            logger.info("taskItemMap is null");
            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        for (int i=0; i< taskItems.size(); i++) {
            if (taskId.equals(taskItems.get(i).getId())) {
                result = taskItems.get(i);
                break;
            }
        }
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
        HashMap<String, Object> response = taskService.getTaskDetailsByIdV2(taskId);
        logger.info("getTaskItems : Out");
        return Response.ok(response).build();
    }
    @Path("/api/v1/components")
    @GET
    public Map<String, TaskComponent> getTaskComponents() throws TodoException {
        logger.info("getTaskComponents : In");
        Map<String, TaskComponent> result = todoConfiguration.getConfigService().getTaskConfig().getTaskComponents();
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
        Map<String, TaskComponent> taskComponentMap =
            todoConfiguration.getConfigService().getTaskConfig().getTaskComponents();
        if (taskComponentMap == null) {
            logger.info("taskComponentMap is null");
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        TaskComponent taskComponent = taskComponentMap.get(componentId);
        if (taskComponent == null) {
            logger.info("taskComponent is null for id : {}", componentId);
            throw new TodoException(ErrorCodes.TASK_COMPONENT_NOT_FOUND);
        }
        logger.info("getTaskComponent : Out");
        return taskComponent;
    }
    @Path("/api/v2/components/{id}")
    @GET
    public Response getTaskComponentDetails(@PathParam("id") String componentId) throws TodoException {
        logger.info("getTaskComponentDetails : In");
        HashMap<String, Object> response = new HashMap<String, Object>();
        Map<String, TaskComponent> taskComponentMap =
            todoConfiguration.getConfigService().getTaskConfig().getTaskComponents();
        if (taskComponentMap == null) {
            logger.info("taskComponentMap is null");
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        TaskComponent taskComponent = taskComponentMap.get(componentId);
        if (taskComponent == null) {
            logger.info("taskComponent is null for id : {}", componentId);
            throw new TodoException(ErrorCodes.TASK_COMPONENT_NOT_FOUND);
        }
        response.put("component", taskComponent);
        HashMap<String, Object> taskDetails = taskService.getTaskDetails(taskComponent.getTaskId(), null);
        response.put(TaskComponentParams.TASK_DETAILS.getName(),
            taskDetails.get(TaskComponentParams.TASK_DETAILS.getName()));
        logger.info("getTaskComponentDetails : Out");
        return Response.ok(response).build();
    }
    @Path("/api/v3/components/{id}")
    @GET
    public Response getTaskComponentDetailsV3(@PathParam("id") String componentId) throws TodoException {
        logger.info("getTaskComponentDetailsV3 : In");
        Map<String, Object> response = new HashMap<String, Object>();
        Map<String, TaskComponent> taskComponentMap =
            todoConfiguration.getConfigService().getTaskConfig().getTaskComponents();
        if (taskComponentMap == null) {
            logger.info("taskComponentMap is null");
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        TaskComponent taskComponent = taskComponentMap.get(componentId);
        if (taskComponent == null) {
            logger.info("taskComponent is null for id : {}", componentId);
            throw new TodoException(ErrorCodes.TASK_COMPONENT_NOT_FOUND);
        }
        response.put("component", taskComponent);
        response.put(TaskComponentParams.APPLICATION.getName(),
            taskService.getTaskComponentApplication(componentId));
        logger.info("getTaskComponentDetailsV3 : Out");
        return Response.ok(response).build();
    }
    @Path("/api/v1/app/all")
    @GET
    public TaskApplications getTaskApplications() throws TodoException {
        logger.info("getTaskApplications : In");
        TaskApplications result = todoConfiguration.getConfigService().getTaskConfig().getTaskApplications();
        if (result == null) {
            logger.info("result is null");
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        logger.info("getTaskApplications : Out");
        return result;
    }
    @Path("/api/v2/app/all")
    @GET
    public ArrayList<Map<String, Object>> getTaskApplicationsV2() throws TodoException {
        logger.info("getTaskApplications : In");
        ArrayList<Map<String, Object>> response = new ArrayList<Map<String, Object>>();
        TaskApplications taskApplications = todoConfiguration.getConfigService().getTaskConfig().getTaskApplications();
        if (taskApplications == null) {
            logger.info("taskApplications is null");
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        ArrayList<TaskApplication> apps = taskApplications.getTaskApplications();
        if (apps == null) {
            logger.info("app is null");
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        for (TaskApplication taskApplication : apps) {
            response.add(taskService.getTaskApplicationByIdV2(taskApplication.getId()));
        }
        logger.info("getTaskApplications : Out");
        return response;
    }
    @Path("/api/v1/app/id/{appId}")
    @GET
    public TaskApplication getTaskApplicationsByAppId(@PathParam("appId") String appId)
        throws TodoException {
        logger.info("getTaskApplicationsByAppId : In");
        TaskApplication taskApplication = taskService.getTaskApplicationByIdV1(appId);
        if (taskApplication == null) {
            logger.info("taskApplicationById is null");
            throw new TodoException(ErrorCodes.TASK_APPLICATION_NOT_FOUND);
        }
        logger.info("getTaskApplicationsByAppId : Out");
        return taskApplication;
    }
    @Path("/api/v2/app/id/{appId}")
    @GET
    public Map<String, Object> getTaskApplicationsByAppIdV2(@PathParam("appId") String appId)
        throws TodoException {
        logger.info("getTaskApplicationsByAppIdV2 : In");
        Map<String, Object> response = taskService.getTaskApplicationByIdV2(appId);
        if (response == null) {
            logger.info("Invalid appId : {}", appId);
            throw new TodoException(ErrorCodes.INVALID_QUERY_PARAMS);
        }
        logger.info("getTaskApplicationsByAppIdV2 : Out");
        return response;
    }
}
