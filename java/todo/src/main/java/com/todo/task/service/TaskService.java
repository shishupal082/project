package com.todo.task.service;

import com.todo.TodoConfiguration;
import com.todo.parser.string_parser.StringParser;
import com.todo.task.TaskComponentParams;
import com.todo.task.config.*;
import com.todo.utils.ErrorCodes;
import com.todo.utils.TodoException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by shishupalkumar on 17/02/17.
 */
public class TaskService {
    private static Logger logger = LoggerFactory.getLogger(TaskService.class);
    private TodoConfiguration todoConfiguration;
    public TaskService(TodoConfiguration todoConfiguration) {
        this.todoConfiguration = todoConfiguration;
    }
    private static String parseComponentId(String str) {
        StringParser stringParser = new StringParser(str);
//        String[] strs = (String[]) stringParser.getValue("name");
        return (String) stringParser.getValue("id");
    }

    private Object getComponentdetails(String componentId, ArrayList<String> componentParams) {
        if (componentId == null) {
            return null;
        }
        Map<String, TaskComponent> taskComponentMap =
            todoConfiguration.getConfigService().getTaskConfig().getTaskComponents();
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
    private Object getAppDetailsByAppId(String appId, ArrayList<String> componentReqParams) {
        Map<String, ArrayList<ArrayList<Object>>> response = new HashMap<String, ArrayList<ArrayList<Object>>>();
        TaskApplications taskApplications = todoConfiguration.getConfigService().getTaskConfig().getTaskApplications();
        if (taskApplications == null) {
            logger.info("taskApplications is null");
            return null;
        }
        TaskApplication taskApplication = taskApplications.getTaskApplicationByAppId(appId);
        if (taskApplication == null) {
            logger.info("Invalid taskApplicationById : {}", appId);
            return null;
        }
        ArrayList<ArrayList<Object>> componentDetails;
        ArrayList<Object> componentDetailsV2;
        Object componentDetail;
        for (Map.Entry<String, String[][]> entry : taskApplication.getPath().entrySet()) {
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
            componentDetails = this.getComponentdetails(parseComponentId(componentId), requiredParams);
            if (componentDetails == null) {
                continue;
            }
            response.add(componentDetails);
        }
        return response;
    }
    public HashMap<String, Object> getTaskDetails(String taskId, ArrayList<String> requiredParams) throws TodoException {
        ArrayList<TaskItem> taskItems = todoConfiguration.getConfigService().getTaskConfig().getTaskItems();
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
        TaskApplications taskApplications = todoConfiguration.getConfigService().getTaskConfig().getTaskApplications();
        if (taskApplications == null || componentId == null) {
            logger.info("taskApplications or componentId is null");
            return null;
        }
        ArrayList<TaskApplication> allApplications = taskApplications.getTaskApplications();
        if (allApplications == null) {
            logger.info("allApplications is null");
            return null;
        }
        ArrayList<String> componentUses;
        String appId, appVariable;
        for (TaskApplication taskApplication : allApplications) {
            for (Map.Entry<String, String[][]> entry1 : taskApplication.getPath().entrySet()) {
                componentUses = new ArrayList<String>();
                appVariable = entry1.getKey();
                for (String[] strings : entry1.getValue()) {
                    if (strings == null) {
                        continue;
                    }
                    for (String str: strings) {
                        if (componentId.equals(str)) {
                            componentUses.add(taskApplication.getId());
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
    public HashMap<String, Object> getTaskDetailsByIdV2(String taskId) {
        ArrayList<String> requiredComponentParams = new ArrayList<String>();
        requiredComponentParams.add(TaskComponentParams.NAME.getName());
        requiredComponentParams.add(TaskComponentParams.APPLICATION.getName());
        return getTaskDetails(taskId, requiredComponentParams);
    }
    public TaskApplication getTaskApplicationByIdV1(String appId) {
        TaskApplications taskApplications = todoConfiguration.getConfigService().getTaskConfig().getTaskApplications();
        if (taskApplications == null) {
            logger.info("taskApplications is null");
            return null;
        }
        return taskApplications.getTaskApplicationByAppId(appId);
    }
    public Map<String, Object> getTaskApplicationByIdV2(String appId) {
        TaskApplication taskApplication = getTaskApplicationByIdV1(appId);
        if (taskApplication == null) {
            logger.info("taskApplications is null");
            return null;
        }
        Map<String, Object> response = new HashMap<String, Object>();
        ArrayList<String> componentRequiredParams = new ArrayList<String>();
        componentRequiredParams.add(TaskComponentParams.ID.getName());
        componentRequiredParams.add(TaskComponentParams.NAME.getName());
        componentRequiredParams.add(TaskComponentParams.TASK_ID.getName());
//        componentRequiredParams.add(TaskComponentParams.TASK_DETAILS.getName());
        response.put("id", taskApplication.getId());
        response.put("options", taskApplication.getOptions());
        response.put("path", taskApplication.getPath());
        response.put("pathComponent", getAppDetailsByAppId(taskApplication.getId(), componentRequiredParams));
        return response;
    }
}
