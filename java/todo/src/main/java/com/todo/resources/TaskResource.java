package com.todo.resources;

import com.todo.TodoConfiguration;
import com.todo.common.TodoException;
import com.todo.constants.AppConstant;
import com.todo.task.config.component.TaskComponent;
import com.todo.task.service.TaskService;
import com.todo.utils.ErrorCodes;
import com.todo.utils.StringUtils;
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
    public Response getTaskItems() throws TodoException {
        logger.info("getTaskItems : In");
        ArrayList<Map<String, Object>> response = taskService.getAllTaskItems(AppConstant.V1);
        if (response == null) {
            logger.info("taskItemMap is null");
            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        logger.info("getTaskItems : Out");
        return Response.ok(response).build();
    }
    @Path("/api/v1/tasks/byid")
    @GET
    public Response getTaskItemsById() throws TodoException {
        logger.info("getTaskItems : In");
        ArrayList<Map<String, Object>> response = taskService.getAllTaskItems(AppConstant.V1);
        if (response == null) {
            logger.info("taskItemMap is null");
            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        response = StringUtils.sortObjectArray(response, "id");
        logger.info("getTaskItems : Out");
        return Response.ok(response).build();
    }
    @Path("/api/v2/tasks")
    @GET
    public Response getTaskItemsV2() throws TodoException {
        logger.info("getTaskItems : In");
        ArrayList<Map<String, Object>> response = taskService.getAllTaskItems(AppConstant.V2);
        if (response == null) {
            logger.info("taskItemMap is null");
            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        logger.info("getTaskItems : Out");
        return Response.ok(response).build();
    }
//    @Path("/api/v3/tasks")
//    @GET
//    public Response getTaskItemsV3() throws TodoException {
//        logger.info("getTaskItems : In");
//        ArrayList<Map<String, Object>> response = taskService.getAllTaskItems("v3");
//        if (response == null) {
//            logger.info("taskItemMap is null");
//            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
//        }
//        logger.info("getTaskItems : Out");
//        return Response.ok(response).build();
//    }
    @Path("/api/v1/tasks/{taskId}")
    @GET
    public Response getTaskByIdV1(@PathParam("taskId") String taskId) throws TodoException {
        logger.info("getTaskItems : In");
        ArrayList<Map<String, Object>> response = new ArrayList<Map<String, Object>>();
        Map<String, Object> taskDetailsById = taskService.getTaskDetailsById(taskId, AppConstant.V1);
        if (taskDetailsById == null) {
            logger.info("response is null");
            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        response.add(taskDetailsById);
        logger.info("getTaskItems : Out");
        return Response.ok(response).build();
    }
    @Path("/api/v2/tasks/{taskId}")
    @GET
    public Response getTaskByIdV2(@PathParam("taskId") String taskId) throws TodoException {
        logger.info("getTaskItems : In");
        ArrayList<Map<String, Object>> response = new ArrayList<Map<String, Object>>();
        Map<String, Object> taskDetailsById = taskService.getTaskDetailsById(taskId, AppConstant.V2);
        if (taskDetailsById == null) {
            logger.info("response is null");
            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        response.add(taskDetailsById);
        logger.info("getTaskItems : Out");
        return Response.ok(response).build();
    }
//    @Path("/api/v3/tasks/{taskId}")
//    @GET
//    public Response getTaskByIdV3(@PathParam("taskId") String taskId) throws TodoException {
//        logger.info("getTaskItems : In");
//        Map<String, Object> response = taskService.getTaskDetailsById(taskId, "v3");
//        if (response == null) {
//            logger.info("response is null");
//            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
//        }
//        logger.info("getTaskItems : Out");
//        return Response.ok(response).build();
//    }
    @Path("/api/v1/component/all")
    @GET
    public Map<String, TaskComponent> getTaskComponents() throws TodoException {
        logger.info("getComponent : In");
        Map<String, TaskComponent> result = todoConfiguration.getConfigInterface().getTaskConfigDB(
                todoConfiguration.getConfigInterface().getAppConfig()).getTaskComponents();
        if (result == null) {
            logger.info("result is null");
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        logger.info("getComponent : Out");
        return result;
    }
    @Path("/api/v1/component/id/{id}")
    @GET
    public Map<String, TaskComponent> getTaskComponent(@PathParam("id") String componentId)
        throws TodoException {
        logger.info("getComponent : In");
        Map<String, TaskComponent> taskComponentMap =
            todoConfiguration.getConfigInterface().getTaskConfigDB(
                    todoConfiguration.getConfigInterface().getAppConfig()).getTaskComponents();
        if (taskComponentMap == null) {
            logger.info("taskComponentMap is null");
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        TaskComponent taskComponent = taskComponentMap.get(componentId);
        if (taskComponent == null) {
            logger.info("taskComponent is null for id : {}", componentId);
            throw new TodoException(ErrorCodes.TASK_COMPONENT_NOT_FOUND);
        }
        HashMap<String, TaskComponent> response = new HashMap<String, TaskComponent>();
        response.put(taskComponent.getId(), taskComponent);
        logger.info("getComponent : Out");
        return response;
    }
    @Path("/api/v1/app/all")
    @GET
    public ArrayList<Map<String, Object>> getTaskApplications() throws TodoException {
        logger.info("getTaskApplications : In");
        ArrayList<Map<String, Object>> response = taskService.getAllApplication(AppConstant.V1);
        if (response == null) {
            logger.info("response is null");
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        logger.info("getTaskApplications : Out");
        return response;
    }
    @Path("/api/v2/app/all")
    @GET
    public ArrayList<Map<String, Object>> getTaskApplicationsV2() throws TodoException {
        logger.info("getTaskApplications : In");
        ArrayList<Map<String, Object>> response = taskService.getAllApplication(AppConstant.V2);
        if (response == null) {
            logger.info("response is null");
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        logger.info("getTaskApplications : Out");
        return response;
    }
//    @Path("/api/v3/app/all")
//    @GET
//    public ArrayList<Map<String, Object>> getTaskApplicationsV3() throws TodoException {
//        logger.info("getTaskApplications : In");
//        ArrayList<Map<String, Object>> response = taskService.getAllApplication("v3");
//        if (response == null) {
//            logger.info("response is null");
//            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
//        }
//        logger.info("getTaskApplications : Out");
//        return response;
//    }
    @Path("/api/v1/app/id/{appId}")
    @GET
    public ArrayList<Map<String, Object>> getTaskApplicationsByAppId(@PathParam("appId") String appId)
        throws TodoException {
        logger.info("getTaskApplicationsByAppId : In");
        ArrayList<Map<String, Object>> response = new ArrayList<Map<String, Object>>();
        Map<String, Object> appById = taskService.getApplicationById(appId, AppConstant.V1);
        if (appById == null) {
            logger.info("taskApplicationById is null");
            throw new TodoException(ErrorCodes.TASK_APPLICATION_NOT_FOUND);
        }
        response.add(appById);
        logger.info("getTaskApplicationsByAppId : Out");
        return response;
    }
    @Path("/api/v2/app/id/{appId}")
    @GET
    public ArrayList<Map<String, Object>> getTaskApplicationsByAppIdV2(@PathParam("appId") String appId)
        throws TodoException {
        logger.info("getTaskApplicationsByAppId : In");
        ArrayList<Map<String, Object>> response = new ArrayList<Map<String, Object>>();
        Map<String, Object> appById = taskService.getApplicationById(appId, AppConstant.V2);
        if (appById == null) {
            logger.info("Invalid appId : {}", appId);
            throw new TodoException(ErrorCodes.INVALID_QUERY_PARAMS);
        }
        response.add(appById);
        logger.info("getTaskApplicationsByAppId : Out");
        return response;
    }
//    @Path("/api/v3/app/id/{appId}")
//    @GET
//    public Map<String, Object> getTaskApplicationsByAppIdV3(@PathParam("appId") String appId)
//        throws TodoException {
//        logger.info("getTaskApplicationsByAppId : In");
//        Map<String, Object> response = taskService.getApplicationById(appId, "v3");
//        if (response == null) {
//            logger.info("Invalid appId : {}", appId);
//            throw new TodoException(ErrorCodes.INVALID_QUERY_PARAMS);
//        }
//        logger.info("getTaskApplicationsByAppId : Out");
//        return response;
//    }
}
