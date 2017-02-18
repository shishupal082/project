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
        updateTaskApplication(taskConfig);
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
            Map<String, TaskItem> taskItems = taskConfig.getTaskItems();
            TaskItem tempTaskItem = null;
            Map<String, String> tempHashMap = new HashMap<String, String>();
            for(Map.Entry<String, TaskItem> entry : taskItems.entrySet()) {
                tempTaskItem = entry.getValue();
                if (tempTaskItem.getComponent() == null) {
                    logger.info("Component not found : {}", tempTaskItem);
                    throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
                }
                for (String componentId : tempTaskItem.getComponent()) {
                    if (tempHashMap.containsKey(componentId)) {
                        logger.info("Duplicate entry found for componentId : {}", componentId);
                        throw new TodoException(ErrorCodes.DUPLICATE_ENTRY);
                    }
                    tempHashMap.put(componentId, entry.getKey());
                }
            }
            logger.info("ComponentId vs taskId : {}", tempHashMap);
            for (String taskComponentPath: taskComponentsPath) {
                taskComponents = mapper.readValue(new File(taskComponentPath), TaskComponents.class);
                result.putAll(taskComponents.getTaskComponents());
            }
            for (Map.Entry<String, TaskComponent> entry : result.entrySet()) {
                String taskItem = tempHashMap.get(entry.getKey());
                if (taskItem == null) {
                    logger.info("taskItem not found for component : {}", entry.getKey());
                    throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
                }
                entry.getValue().setTaskItem(taskItem);
            }
            finalTaskComponents.setTaskComponents(result);
        } catch (IOException ioe) {
            logger.info("IOE : for file : taskComponentsPath");
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        taskConfig.setTaskComponents(finalTaskComponents.getTaskComponents());
        logger.info("TaskComponents loaded with data : {}", finalTaskComponents);
    }
    public static void updateTaskApplication(TaskConfig taskConfig) throws TodoException {
        TaskApplications taskApplications = null;
        TaskApplications finalTaskApplications = new TaskApplications();
        Map<String, Map<String, String[][]>> result = new HashMap<String, Map<String, String[][]>>();
        ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
        String[] taskApplicationsPath = taskConfig.getTaskApplicationPath();
        try {
            for (String taskApplicationPath: taskApplicationsPath) {
                taskApplications = mapper.readValue(new File(taskApplicationPath), TaskApplications.class);
                result.putAll(taskApplications.getTaskApplications());
            }
            finalTaskApplications.setTaskApplications(result);
        } catch (IOException ioe) {
            logger.info("IOE : for file : taskComponentsPath");
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        taskConfig.setTaskApplications(finalTaskApplications);
        logger.info("TaskApplications loaded with data : {}", finalTaskApplications);
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
        logger.info("TaskComponent for id : {}, {}", componentId, tempTaskComponent);
        if (requiredParams == null) {
            return tempTaskComponent.getName();
        }
        Map<String, Object> componentDetails = new HashMap<String, Object>();
        for(String requiredParam : requiredParams) {
            if (requiredParam.equals("id")) {
                componentDetails.put(requiredParam, componentId);
            }
            if (requiredParam.equals("name")) {
                componentDetails.put(requiredParam, tempTaskComponent.getName());
            }
            if (requiredParam.equals("taskItem")) {
                componentDetails.put(requiredParam, tempTaskComponent.getTaskItem());
            }
            if (requiredParam.equals("application")) {
                componentDetails.put(requiredParam, getTaskComponentApplication(componentId));
            }
        }
        return componentDetails;
    }
    public Object getAppDetailsByAppId(String appId, ArrayList<String> componentReqParams) {
        Map<String, ArrayList<ArrayList<Object>>> response = new HashMap<String, ArrayList<ArrayList<Object>>>();
        TaskApplications taskApplications = taskConfiguration.getTaskApplications();
        if (taskApplications == null) {
            logger.info("taskApplications is null");
            return null;
        }
        Map<String, String[][]> applicationDetails = taskApplications.getTaskApplications().get(appId);
        if (applicationDetails == null) {
            logger.info("taskApplicationById is null");
            return null;
        }
        ArrayList<ArrayList<Object>> componentDetails;
        ArrayList<Object> componentDetailsV2;
        Object componentDetail;
        for (Map.Entry<String, String[][]> entry : applicationDetails.entrySet()) {
            componentDetails = new ArrayList<ArrayList<Object>>();
            for (String[] strings : entry.getValue()) {
                componentDetailsV2 = new ArrayList<Object>();
                for (String componentId: strings) {
                    componentDetail = getComponentdetails(componentId, componentReqParams);
                    if (componentDetail == null) {
                        componentDetailsV2.add(componentId);
                    } else {
                        componentDetailsV2.add(componentDetail);
                    }
                }
                componentDetails.add(componentDetailsV2);
            }
            response.put(entry.getKey(), componentDetails);
        }
        logger.info("App details for app id : {}, {}", appId, response);
        return response;
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
    public Object getTaskDetails(String taskId, ArrayList<String> requiredParams) throws TodoException {
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
        response.put("components", taskItemById.getComponent());
        if (requiredParams != null) {
            response.put("componentDetails", getComponents(taskItemById.getComponent(), requiredParams));
        }
        return response;
    }
    public ArrayList<ArrayList<String>> getTaskComponentApplication(String componentId) {
        ArrayList<ArrayList<String>> response = new ArrayList<ArrayList<String>>();
        TaskApplications taskApplications = taskConfiguration.getTaskApplications();
        if (taskApplications == null || componentId == null) {
            logger.info("taskApplications or componentId is null");
            return null;
        }
        Map<String, Map<String, String[][]>> allApplications = taskApplications.getTaskApplications();
        if (allApplications == null) {
            logger.info("allApplications is null");
            return null;
        }
        ArrayList<String> componentUses;
        String appName, appVariable;
        for (Map.Entry<String, Map<String, String[][]>> entry : allApplications.entrySet()) {
            appName = entry.getKey();
            if (entry.getValue() == null) {
                continue;
            }
            for (Map.Entry<String, String[][]> entry1 : entry.getValue().entrySet()) {
                componentUses = new ArrayList<String>();
                appVariable = entry1.getKey();
                for (String[] strings : entry1.getValue()) {
                    if (strings == null) {
                        continue;
                    }
                    for (String str: strings) {
                        if (componentId.equals(str)) {
                            componentUses.add(appName);
                            componentUses.add(appVariable);
                        }
                    }
                }
                if (componentUses.size() > 0) {
                    response.add(componentUses);
                }
            }
        }
        if (response.size() > 0) {
            return response;
        }
        return null;
    }
}
