package com.todo.task.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.todo.task.TaskComponentParams;
import com.todo.task.config.*;
import com.todo.utils.ErrorCodes;
import com.todo.utils.StringUtils;
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
    private static ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
    private TaskConfig taskConfiguration;
    public TaskService(TaskConfig taskConfig) {
        this.taskConfiguration = taskConfig;
    }
    public static TaskConfig getTaskConfig(String taskConfigPath) {
        TaskConfig taskConfig = null;
        try {
            taskConfig = mapper.readValue(new File(taskConfigPath), TaskConfig.class);
        } catch (IOException ioe) {
            logger.info("IOE : for file : {}, {}", taskConfigPath, ioe);
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        return taskConfig;
    }
    public static TaskConfig updateTaskConfig(String taskConfigPath) throws TodoException {
        TaskConfig taskConfig = getTaskConfig(taskConfigPath);
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
        ArrayList<TaskItem> result = new ArrayList<TaskItem>();
        String[] taskItemsPath = taskConfig.getTaskItemsPath();
        String parsingPath = null;
        try {
            for (String taskItemPath: taskItemsPath) {
                parsingPath = taskItemPath;
                taskItems = mapper.readValue(new File(taskItemPath), TaskItems.class);
                result.addAll(taskItems.getTaskItems());
            }
            finalTaskItems.setTaskItems(result);
        } catch (IOException e) {
            logger.info("Exception for file : {}, {}", parsingPath, e);
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        taskConfig.setTaskItems(finalTaskItems.getTaskItems());
        logger.info("TaskItems loaded with data : {}", finalTaskItems);
    }
    private static void updateTaskComponents(TaskConfig taskConfig) throws TodoException {
        TaskComponents taskComponents = null;
        TaskComponents finalTaskComponents = new TaskComponents();
        Map<String, TaskComponent> result = new HashMap<String, TaskComponent>();
        String[] taskComponentsPath = taskConfig.getTaskComponentPath();
        String parsingPath = null;
        try {
            ArrayList<TaskItem> taskItems = taskConfig.getTaskItems();
            Map<String, String> componentIdVsTaskId = new HashMap<String, String>();
            for(TaskItem taskItem : taskItems) {
                if (taskItem.getComponent() == null) {
                    logger.info("Component not found : {}", taskItem);
                    continue;
                }
                for (String componentId : taskItem.getComponent()) {
                    if (componentIdVsTaskId.containsKey(componentId)) {
                        logger.info("Duplicate entry found for componentId : {}, {}", componentId, taskItem);
                        throw new TodoException(ErrorCodes.DUPLICATE_ENTRY);
                    }
                    componentIdVsTaskId.put(componentId, taskItem.getId());
                }
            }
            logger.info("ComponentId vs taskId : {}", componentIdVsTaskId);
//            for (String taskComponentPath: taskComponentsPath) {
//                parsingPath = taskComponentPath;
//                taskComponents = mapper.readValue(new File(taskComponentPath), TaskComponents.class);
//                result.putAll(taskComponents.getTaskComponents());
//            }
            for (Map.Entry<String, String> entry : componentIdVsTaskId.entrySet()) {
                String taskComponentId = entry.getKey();
                String taskId = entry.getValue();
                TaskComponent taskComponent = new TaskComponent();
                taskComponent.setId(taskComponentId);
                taskComponent.setTaskId(taskId);
                taskComponent.setName(taskComponentId);
                result.put(taskComponentId, taskComponent);
            }
            finalTaskComponents.setTaskComponents(result);
        } catch (Exception e) {
            logger.info("Exception for file : {}, {}", parsingPath, e);
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        taskConfig.setTaskComponents(finalTaskComponents.getTaskComponents());
        logger.info("TaskComponents loaded with data : {}", finalTaskComponents);
    }
    private static void updateTaskApplication(TaskConfig taskConfig) throws TodoException {
        TaskApplications taskApplications = null;
        TaskApplications finalTaskApplications = new TaskApplications();
        Map<String, Map<String, String[][]>> result = new HashMap<String, Map<String, String[][]>>();
        String[] taskApplicationsPath = taskConfig.getTaskApplicationPath();
        String parsingPath = null;
        try {
            for (String taskApplicationPath: taskApplicationsPath) {
                parsingPath = taskApplicationPath;
                taskApplications = mapper.readValue(new File(taskApplicationPath), TaskApplications.class);
                result.putAll(taskApplications.getTaskApplications());
            }
            finalTaskApplications.setTaskApplications(result);
        } catch (IOException e) {
            logger.info("Exception for file : {}, {}", parsingPath, e);
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        taskConfig.setTaskApplications(finalTaskApplications);
        logger.info("TaskApplications loaded with data : {}", finalTaskApplications);
    }
    private Object getComponentdetails(String componentId, ArrayList<String> componentParams) {
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
        if (componentParams == null) {
            return tempTaskComponent.getName();
        }
        Map<String, Object> componentDetails = new HashMap<String, Object>();
        for(String requiredParam : componentParams) {
            if (TaskComponentParams.ID.getName().equals(requiredParam)) {
                componentDetails.put(requiredParam, componentId);
                continue;
            }
            if (TaskComponentParams.NAME.getName().equals(requiredParam)) {
                componentDetails.put(requiredParam, tempTaskComponent.getName());
                continue;
            }
            if (TaskComponentParams.TASK_ID.getName().equals(requiredParam)) {
                componentDetails.put(requiredParam, tempTaskComponent.getTaskId());
                continue;
            }
            if (TaskComponentParams.TASK_DETAILS.getName().equals(requiredParam)) {
                componentDetails.put(requiredParam,
                    getTaskDetails(tempTaskComponent.getTaskId(), null).get(
                        TaskComponentParams.TASK_DETAILS.getName()));
                continue;
            }
            if (TaskComponentParams.APPLICATION.getName().equals(requiredParam)) {
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
    private ArrayList<Object> getComponents(String[] componentIds, ArrayList<String> requiredParams) {
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
    public HashMap<String, Object> getTaskDetails(String taskId, ArrayList<String> requiredParams) throws TodoException {
        ArrayList<TaskItem> taskItems = taskConfiguration.getTaskItems();
        if (taskItems == null) {
            logger.info("taskItemMap is null");
            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        Integer index = null;
        for (int i=0; i<taskItems.size(); i++) {
            if (taskId.equals(taskItems.get(i).getId())) {
                index = i;
                break;
            }
        }
        if (index == null) {
            logger.info("Task not found for taskid : {}", taskId);
            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        TaskItem taskItemById = taskItems.get(index);

        logger.info("taskItemById found : {}", taskItemById);
        HashMap<String, Object> response = new HashMap<String, Object>();
        response.put(TaskComponentParams.TASK_DETAILS.getName(), taskItemById);
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
