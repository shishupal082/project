package com.todo.task.service;

import com.todo.TodoConfiguration;
import com.todo.constants.AppConstant;
import com.todo.task.config.component.TaskComponent;
import com.todo.task.config.response.PathComponentDetails;
import com.todo.utils.StringParser;
import com.todo.yaml.todo.Path;
import com.todo.yaml.todo.TaskApplication;
import com.todo.yaml.todo.TaskApplications;
import com.todo.yaml.todo.TaskItem;
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

    private Object getPathComponentByPath(TaskApplication taskApplication) {
//        Map<String, ArrayList<ArrayList<PathComponentDetails>>> response =
//            new HashMap<String, ArrayList<ArrayList<PathComponentDetails>>>();
//        Map<String, String[][]> applicationPath = taskApplication.getPath();
        ArrayList<Path> paths = taskApplication.getPaths();
        ArrayList<HashMap<String, Object>> r = new ArrayList<HashMap<String, Object>>();
        Map<String, TaskComponent> taskComponentMap =
                todoConfiguration.getConfigInterface().getTaskConfigDB(
                        todoConfiguration.getConfigInterface().getAppConfig()).getTaskComponents();
        if (paths == null) {
            logger.info("applicationPaths is null");
            return null;
        }
        for (Path path : paths) {
            HashMap<String, Object> pathComponentDetailsObj = new HashMap<String, Object>();
            ArrayList<ArrayList<Object>> r1 = new ArrayList<ArrayList<Object>>();
            if (path == null || path.getDetails() == null) {
                continue;
            }
            pathComponentDetailsObj.put("name", path.getName());
            ArrayList<ArrayList<String>> pathDetails = path.getDetails();
            for (ArrayList<String> pathDetail : pathDetails) {
                ArrayList<Object> r2 = new ArrayList<Object>();
                if (pathDetail == null) {
                    continue;
                }
                for (String pathComponent : pathDetail) {
                    String pathComponentId = parseComponentId(pathComponent);
                    HashMap<String, Object> pathComponentDetailsObjV2 = new HashMap<String, Object>();
                    TaskComponent componentDetails = taskComponentMap.get(pathComponentId);
                    if (componentDetails == null) {
                        componentDetails = new TaskComponent();
                        componentDetails.setId(pathComponentId);
                        ArrayList<PathComponentDetails> pathComponentDetailsArrayList =
                                new ArrayList<PathComponentDetails>();
                        PathComponentDetails pathComponentDetails = new PathComponentDetails();
                        pathComponentDetails.setComponent(pathComponent);
                        pathComponentDetails.setComponentId(pathComponentId);
                        pathComponentDetails.setAppId(taskApplication.getId());
                        pathComponentDetails.setPath(path.getName());
                        pathComponentDetailsArrayList.add(pathComponentDetails);
                        componentDetails.setAppDetails(pathComponentDetailsArrayList);
                    }
                    pathComponentDetailsObjV2.put("id", pathComponentId);
                    pathComponentDetailsObjV2.put("component", pathComponent);
                    pathComponentDetailsObjV2.put("appDetails", componentDetails.getAppDetails());
                    pathComponentDetailsObjV2.put("taskDetails", componentDetails.getTaskDetails());
                    r2.add(pathComponentDetailsObjV2);
                }
                r1.add(r2);
            }
            pathComponentDetailsObj.put("details", r1);
            r.add(pathComponentDetailsObj);
        }
//        if (applicationPath == null) {
//            logger.info("applicationPath is null");
//            return null;
//        }
//        for (Map.Entry<String, String[][]> entry : applicationPath.entrySet()) {
//            ArrayList<ArrayList<PathComponentDetails>> pathComponentDetails =
//                new ArrayList<ArrayList<PathComponentDetails>>();
//            for (String[] strings : entry.getValue()) {
//                ArrayList<PathComponentDetails> componentDetails = new ArrayList<PathComponentDetails>();
//                for (String component: strings) {
//                    String compId = parseComponentId(component);
//                    if (compId == null) {
//                        logger.info("PathComponentId is null for component : {}, taskApplication : {}",
//                            component, taskApplication);
//                        continue;
//                    }
//                    PathComponentDetails pathComponentDetails3 = new PathComponentDetails();
//                    pathComponentDetails3.setAppId(taskApplication.getId());
//                    pathComponentDetails3.setComponent(component);
//                    pathComponentDetails3.setPath(entry.getKey());
//                    pathComponentDetails3.setComponentId(compId);
//                    componentDetails.add(pathComponentDetails3);
//                }
//                pathComponentDetails.add(componentDetails);
//            }
//            response.put(entry.getKey(), pathComponentDetails);
//        }
        return r;
    }
    private ArrayList<Object> getTaskComponents(String[] components) {
        ArrayList<Object> response = new ArrayList<Object>();
        if (components == null) {
            return response;
        }
        Map<String, TaskComponent> taskComponentMap =
            todoConfiguration.getConfigInterface().getTaskConfigDB(
                    todoConfiguration.getConfigInterface().getAppConfig()).getTaskComponents();
        for (String component: components) {
            TaskComponent componentDetails = taskComponentMap.get(parseComponentId(component));
            HashMap<String, Object> componentDetailsObj = new HashMap<String, Object>();
            if (componentDetails == null) {
                logger.info("TaskComponent not found for component : {}", component);
                continue;
            }
            componentDetailsObj.put("id", componentDetails.getId());
            componentDetailsObj.put("component", component);
            componentDetailsObj.put("appDetails", componentDetails.getAppDetails());
            componentDetailsObj.put("taskDetails", componentDetails.getTaskDetails());
            response.add(componentDetailsObj);
        }
        return response;
    }
//    private ArrayList<ArrayList<String>> getTaskComponentApplication(String componentId) {
//        if (componentId == null) {
//            logger.info("componentId is null");
//            return null;
//        }
//        ArrayList<ArrayList<String>> response = new ArrayList<ArrayList<String>>();
//        Map<String, TaskComponent> taskComponentMap =
//            todoConfiguration.getConfigService().getTaskConfigDB().getTaskComponents();
//        TaskComponent tempTaskComponent = taskComponentMap.get(componentId);
//        if (tempTaskComponent == null) {
//            logger.info("Invalid componentId : {}", componentId);
//            return null;
//        }
//        ArrayList<String> componentUses;
//        for (PathComponentDetails taskComponentAppDetail : tempTaskComponent.getAppDetails()) {
//            componentUses = new ArrayList<String>();
//            componentUses.add(taskComponentAppDetail.getAppId());
//            componentUses.add(taskComponentAppDetail.getPath());
//            componentUses.add(taskComponentAppDetail.getComponent());
//            response.add(componentUses);
//        }
//        if (response.size() > 0) {
//            return response;
//        }
//        return null;
//    }
    private TaskItem getTaskItemById(String taskId) {
        if (taskId == null) {
            logger.info("taskId is null");
            return null;
        }
        ArrayList<TaskItem> taskItems = todoConfiguration.getConfigInterface().getTaskConfigDB(
                todoConfiguration.getConfigInterface().getAppConfig()).getTaskItems();
        if (taskItems == null) {
            logger.info("taskItemMap is null");
            return null;
        }
        for (TaskItem taskItem: taskItems) {
            if (taskId.equals(taskItem.getId())) {
                return taskItem;
            }
        }
        logger.info("taskItem not found for taskId : {}", taskId);
        return null;
    }
    private Map<String, Object> getTaskItemByTaskItemResponse(TaskItem taskItem, String version) {
        ArrayList<TaskItem> taskItems = todoConfiguration.getConfigInterface().getTaskConfigDB(
                todoConfiguration.getConfigInterface().getAppConfig()).getTaskItems();
        if (taskItems == null) {
            logger.info("taskItemMap is null");
            return null;
        }
        Map<String, Object> response = new HashMap<String, Object>();
        response.put("id", taskItem.getId());
        response.put("component", taskItem.getComponent());
        response.put("options", taskItem.getOptions());
        if (AppConstant.V2.equals(version)) {
            response.put("history", taskItem.getHistory());
            response.put("componentDetails", getTaskComponents(taskItem.getComponent()));

//        } else if ("v3".equals(version)) {
//            response.put("componentDetails", getTaskComponents(taskItem.getComponent()));
//            response.put("history", taskItem.getHistory());
        }
        return response;
    }
    public Map<String, Object> getTaskDetailsById(String taskId, String version) {
        TaskItem taskItem = this.getTaskItemById(taskId);
        if (taskItem == null) {
            return null;
        }
        return getTaskItemByTaskItemResponse(taskItem, version);
    }
    public ArrayList<Map<String, Object>> getAllTaskItems(String version) {
        ArrayList<TaskItem> taskItems = todoConfiguration.getConfigInterface().getTaskConfigDB(
                todoConfiguration.getConfigInterface().getAppConfig()).getTaskItems();
        if (taskItems == null) {
            logger.info("taskItemMap is null");
            return null;
        }
        ArrayList<Map<String, Object>> response = new ArrayList<Map<String, Object>>();
        for (TaskItem taskItem : taskItems) {
            response.add(getTaskItemByTaskItemResponse(taskItem, version));
        }
        return response;
    }
    private TaskApplication getAppById(String appId) {
        if (appId == null) {
            logger.info("appId is null");
            return null;
        }
        TaskApplications taskApplications = todoConfiguration.getConfigInterface().getTaskConfigDB(
                todoConfiguration.getConfigInterface().getAppConfig()).getTaskApplications();
        if (taskApplications == null || taskApplications.getTaskApplications() == null) {
            logger.info("taskApplications is null");
            return null;
        }
        for (TaskApplication taskApplication: taskApplications.getTaskApplications()) {
            if (appId.equals(taskApplication.getId())) {
                return taskApplication;
            }
        }
        logger.info("taskApplication not found for appId : {}", appId);
        return null;
    }
    private Map<String, Object> getTaskAppLicationByResponse(TaskApplication taskApplication, String version) {
        TaskApplications taskApplications = todoConfiguration.getConfigInterface().getTaskConfigDB(
                todoConfiguration.getConfigInterface().getAppConfig()).getTaskApplications();
        if (taskApplications == null || taskApplications.getTaskApplications() == null) {
            logger.info("taskApplications is null");
            return null;
        }
        Map<String, Object> response = new HashMap<String, Object>();
        response.put("id", taskApplication.getId());
        response.put("path", taskApplication.getPath());
        response.put("paths", taskApplication.getPaths());
        response.put("options", taskApplication.getOptions());
        if (AppConstant.V2.equals(version)) {
            response.put("history", taskApplication.getHistory());
            response.put("pathsComponentDetails", getPathComponentByPath(taskApplication));
//        } else if ("v3".equals(version)) {
//            response.put("pathComponent", getPathComponentByPath(taskApplication));
//            response.put("history", taskApplication.getHistory());
        }
        return response;
    }
    public Map<String, Object> getApplicationById(String appId, String version) {
        TaskApplication taskApplication = this.getAppById(appId);
        if (taskApplication == null) {
            return null;
        }
        return getTaskAppLicationByResponse(taskApplication, version);
    }
    public ArrayList<Map<String, Object>> getAllApplication(String version) {
        TaskApplications taskApplications = todoConfiguration.getConfigInterface().getTaskConfigDB(
                todoConfiguration.getConfigInterface().getAppConfig()).getTaskApplications();
        if (taskApplications == null || taskApplications.getTaskApplications() == null) {
            logger.info("taskItemMap is null");
            return null;
        }
        ArrayList<Map<String, Object>> response = new ArrayList<Map<String, Object>>();
        for (TaskApplication taskApplication : taskApplications.getTaskApplications()) {
            response.add(getTaskAppLicationByResponse(taskApplication, version));
        }
        return response;
    }
}
