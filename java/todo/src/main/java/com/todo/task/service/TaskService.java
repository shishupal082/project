package com.todo.task.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.todo.task.config.*;
import com.todo.utils.ErrorCodes;
import com.todo.utils.TodoException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by shishupalkumar on 17/02/17.
 */
public class TaskService {
    private static Logger logger = LoggerFactory.getLogger(TaskService.class);
    private TaskConfig taskConfiguration;
    public TaskService(TaskConfig taskConfig) {
        this.taskConfiguration = taskConfig;
    }
    public static TaskConfig updateTaskConfig(String taskConfigPath) throws TodoException {
        TaskConfig taskConfig = null;
        ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
        try {
            taskConfig = mapper.readValue(new File(taskConfigPath), TaskConfig.class);
        } catch (IOException ioe) {
            logger.info("IOE : for file : {}", taskConfigPath);
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        logger.info("TaskConfig loaded with data : {}", taskConfig);
        updateTaskItems(taskConfig);
        updateTaskComponents(taskConfig);
        logger.info("FinalTaskConfig with data : {}", taskConfig);
        return taskConfig;
    }
    private static void updateTaskItems(TaskConfig taskConfig) throws TodoException {
        TaskItems taskItems = null;
        TaskItems finalTaskItems = new TaskItems();
        Map<String, TaskItem> result = new HashMap<String, TaskItem>();
        ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
        String[] taskItemsPath = taskConfig.getTaskItemsPath();
        try {
            for (String taskItemPath: taskItemsPath) {
                taskItems = mapper.readValue(new File(taskItemPath), TaskItems.class);
                result.putAll(taskItems.getTaskItems());
            }
            finalTaskItems.setTaskItems(result);
        } catch (IOException ioe) {
            logger.info("IOE : for file : taskItemsPath");
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        taskConfig.setTaskItems(finalTaskItems.getTaskItems());
        logger.info("TaskItems loaded with data : {}", finalTaskItems);
    }
    private static void updateTaskComponents(TaskConfig taskConfig) throws TodoException {
        TaskComponents taskComponents = null;
        TaskComponents finalTaskComponents = new TaskComponents();
        Map<String, TaskComponent> result = new HashMap<String, TaskComponent>();
        ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
        String[] taskComponentsPath = taskConfig.getTaskComponentPath();
        try {
            for (String taskComponentPath: taskComponentsPath) {
                taskComponents = mapper.readValue(new File(taskComponentPath), TaskComponents.class);
                result.putAll(taskComponents.getTaskComponents());
            }
            finalTaskComponents.setTaskComponents(result);
        } catch (IOException ioe) {
            logger.info("IOE : for file : taskComponentsPath");
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        taskConfig.setTaskComponents(finalTaskComponents.getTaskComponents());
        logger.info("TaskComponents loaded with data : {}", finalTaskComponents);
    }
    public Object getComponentdetails(String componentId, ArrayList<String> requiredParams) {
        if (componentId == null) {
            return null;
        }
        Map<String, TaskComponent> taskComponentMap = taskConfiguration.getTaskComponents();
        TaskComponent tempTaskComponent = taskComponentMap.get(componentId);
        if (tempTaskComponent == null) {
            logger.info("Component not found for componentId : {}", componentId);
            return null;
        }
        logger.info("TaskSomponent for id : {}, {}", componentId, tempTaskComponent);
        if (requiredParams == null) {
            return tempTaskComponent.getName();
        }
        Map<String, String> componentDetails = new HashMap<String, String>();
        for(String requiredParam : requiredParams) {
            if (requiredParam.equals("id")) {
                componentDetails.put("id", componentId);
            }
            if (requiredParam.equals("name")) {
                componentDetails.put("name", tempTaskComponent.getName());
            }
            if (requiredParam.equals("taskItem")) {
                componentDetails.put("taskItem", tempTaskComponent.getTaskItem());
            }
        }
        return componentDetails;
    }
    public ArrayList<Object> getComponents(String[] componentIds, ArrayList<String> requiredParams) {
        ArrayList<Object> response = new ArrayList<Object>();
        if (componentIds == null) {
            return response;
        }
        Object componentDetails = null;
        for (String componentId: componentIds) {
            componentDetails = this.getComponentdetails(componentId, requiredParams);
            if (componentDetails == null) {
                continue;
            }
            response.add(componentDetails);
        }
        return response;
    }
    public Object getTaskDetails(String taskId) throws TodoException {
        Map<String, TaskItem> taskItemMap = taskConfiguration.getTaskItems();
        if (taskItemMap == null) {
            logger.info("taskItemMap is null");
            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        TaskItem taskItemById = taskItemMap.get(taskId);
        if (taskItemById == null) {
            logger.info("Task not found for taskid : {}", taskId);
            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        logger.info("taskItemById found : {}", taskItemById);
        HashMap<String, Object> response = new HashMap<String, Object>();
        response.put("name", taskItemById.getName());
        response.put("place", taskItemById.getPlace());
        ArrayList<String> requiredParams = new ArrayList<String>();
        requiredParams.add("id");
        requiredParams.add("name");
        response.put("components", taskItemById.getComponent());
        requiredParams.add("taskItem");
        response.put("componentDetails", getComponents(taskItemById.getComponent(), requiredParams));
        return response;
    }
}
