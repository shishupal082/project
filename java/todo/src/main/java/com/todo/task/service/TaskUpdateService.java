package com.todo.task.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.todo.parser.string_parser.StringParser;
import com.todo.task.config.TaskComponents;
import com.todo.model.TaskConfigDB;
import com.todo.task.config.component.TaskComponent;
import com.todo.task.config.response.PathComponentDetails;
import com.todo.task.config.response.TaskComponentDetails;
import com.todo.utils.ErrorCodes;
import com.todo.utils.StringUtils;
import com.todo.common.TodoException;
import com.todo.utils.SystemUtils;
import com.todo.yaml.todo.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by shishupalkumar on 18/05/17.
 */
public class TaskUpdateService {
    private static Logger logger = LoggerFactory.getLogger(TaskUpdateService.class);
    private static ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
    public static void updateTaskItems(TaskConfigDB taskConfigDB, ArrayList<String> taskItemsPath) throws TodoException {
        TaskItems taskItems = null;
        TaskItems finalTaskItems = new TaskItems();
        ArrayList<TaskItem> result = new ArrayList<TaskItem>();
        String parsingPath = null;
        try {
            for (String taskItemPath: taskItemsPath) {
                parsingPath = taskItemPath;
                taskItems = mapper.readValue(new File(taskItemPath), TaskItems.class);
                result.addAll(taskItems.getTaskItems());
            }
            finalTaskItems.setTaskItems(result);
            /*
            * Check for duplicate taskId
            * */
            ArrayList<String> tempTaskIds = new ArrayList<String>();
            for (TaskItem tempTaskItem: finalTaskItems.getTaskItems()) {
                if (tempTaskIds.contains(tempTaskItem.getId())) {
                    logger.info("Duplicate entry found for taskId : {}, {}, {}",
                            StringUtils.getLoggerObject(tempTaskItem.getId(), tempTaskItem, tempTaskIds));
                    throw new TodoException(ErrorCodes.DUPLICATE_ENTRY);
                } else {
                    tempTaskIds.add(tempTaskItem.getId());
                }
            }
        } catch (IOException e) {
            logger.info("Exception for file : {}, {}", parsingPath, e);
            logger.info("Current working directory is : {}", SystemUtils.getProjectWorkingDirV2());
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        /*
        * Add input component for the next element
        * */
        Map<String, ArrayList<String>> tempCompOutIdVsCompId = new HashMap<String, ArrayList<String>>();
        if (finalTaskItems.getTaskItems() != null) {
            for (TaskItem tempTaskItem: finalTaskItems.getTaskItems()) {
                String[] taskComponents = tempTaskItem.getComponent();
                if (taskComponents != null) {
                    for (String component: taskComponents) {
                        String componentId = (String) new StringParser(component).getValue("id");
                        String[] componentOuts = (String []) new StringParser(component).getValue("out");
                        if (componentOuts != null) {
                            for (String componentOut: componentOuts) {
                                if (tempCompOutIdVsCompId.get(componentOut) != null) {
                                    tempCompOutIdVsCompId.get(componentOut).add(componentId);
                                } else {
                                    ArrayList<String> componentIds = new ArrayList<String>();
                                    componentIds.add(componentId);
                                    tempCompOutIdVsCompId.put(componentOut, componentIds);
                                }
                            }
                        }
                    }
                }
            }
            for (TaskItem tempTaskItem: finalTaskItems.getTaskItems()) {
                String[] taskComponents = tempTaskItem.getComponent();
                String updatedComponentStr = null;
                if (taskComponents != null) {
                    for (String component: taskComponents) {
                        if (updatedComponentStr != null) {
                            updatedComponentStr += "~~~~~" + component;
                        } else {
                            updatedComponentStr = component;
                        }
                        String componentId = (String) new StringParser(component).getValue("id");
                        if (tempCompOutIdVsCompId.get(componentId) != null) {
                            String inputComponentId = null;
                            for (String compId: tempCompOutIdVsCompId.get(componentId)) {
                                if (inputComponentId != null) {
                                    inputComponentId += "," + compId;
                                } else {
                                    inputComponentId = compId;
                                }
                            }
                            if (inputComponentId != null) {
                                if (updatedComponentStr != null) {
                                    updatedComponentStr +="|in:string[]=" + inputComponentId;
                                }
                            }
                        }
                    }
                    if (updatedComponentStr != null) {
                        tempTaskItem.setComponent(updatedComponentStr.split("~~~~~"));
                    }
                }
            }
        }
        taskConfigDB.setTaskItems(finalTaskItems.getTaskItems());
        logger.info("TaskItems load success.");
//        logger.info("TaskItems loaded with data : {}", finalTaskItems);
    }
    public static void updateTaskComponents(TaskConfigDB taskConfigDB) throws TodoException {
        TaskComponents finalTaskComponents = new TaskComponents();
        Map<String, TaskComponent> result = new HashMap<String, TaskComponent>();
        try {
            ArrayList<TaskItem> tempTaskItems = taskConfigDB.getTaskItems();
            Map<String, String> componentIdVsTaskId = new HashMap<String, String>();
            for(TaskItem taskItem : tempTaskItems) {
                if (taskItem.getComponent() == null) {
                    //logger.info("Component not found : {}", taskItem);
                    continue;
                }
                for (String component : taskItem.getComponent()) {
                    String compId = (String) new StringParser(component).getValue("id");
                    if (compId == null) {
                        logger.info("componentId is null for component : {}, in taskItem : {}", component, taskItem);
                        throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
                    }
                    if (componentIdVsTaskId.containsKey(compId)) {
                        logger.info("Duplicate entry found for componentId : {}, {}", compId, taskItem);
                        throw new TodoException(ErrorCodes.DUPLICATE_ENTRY);
                    }
                    TaskComponent taskComponent = new TaskComponent();
                    taskComponent.setId(compId);
                    TaskComponentDetails taskComponentDetails = new TaskComponentDetails();
                    taskComponentDetails.setTaskId(taskItem.getId());
                    taskComponentDetails.setComponent(component);
                    taskComponentDetails.setComponentId(compId);
                    taskComponent.getTaskDetails().add(taskComponentDetails);
                    result.put(compId, taskComponent);
                    componentIdVsTaskId.put(compId, taskItem.getId());
                }
            }
            TaskApplications taskApplications = taskConfigDB.getTaskApplications();
            if (taskApplications.getTaskApplications() != null) {
                for(TaskApplication taskApplication : taskApplications.getTaskApplications()) {
                    if (taskApplication.getPath() == null) {
                        continue;
                    }
                    for (Map.Entry<String, String[][]> entry : taskApplication.getPath().entrySet()) {
                        String[][] pathComponenets = entry.getValue();
                        if (pathComponenets != null) {
                            for (String[] components : pathComponenets) {
                                if (components != null) {
                                    for (String component : components) {
                                        String compId = (String) new StringParser(component).getValue("id");
                                        if (compId == null) {
                                            continue;
                                        }
                                        TaskComponent tempTaskComponent = result.get(compId);
                                        if (tempTaskComponent == null) {
                                            continue;
                                        }
                                        PathComponentDetails pathComponentDetails = new PathComponentDetails();
                                        pathComponentDetails.setAppId(taskApplication.getId());
                                        pathComponentDetails.setComponent(component);
                                        pathComponentDetails.setPath(entry.getKey());
                                        pathComponentDetails.setComponentId(compId);
                                        tempTaskComponent.getAppDetails().add(pathComponentDetails);
                                        result.put(compId, tempTaskComponent);
                                    }
                                }
                            }
                        }
                    }
                }
                for(TaskApplication taskApplication : taskApplications.getTaskApplications()) {
                    if (taskApplication.getPaths() == null) {
                        continue;
                    }
                    for (Path path: taskApplication.getPaths()) {
                        if (path == null) {
                            continue;
                        }
                        ArrayList<ArrayList<String>> pathDetails = path.getDetails();
                        if(pathDetails != null) {
                            for (ArrayList<String> pathComponents : pathDetails) {
                                if (pathComponents != null) {
                                    for (String pathComponent : pathComponents) {
                                        String pathCompId = (String) new StringParser(pathComponent).getValue("id");
                                        if (pathCompId == null) {
//                                            logger.info("pathCompId is null for pathComponent : {}", pathComponent);
                                            continue;
                                        }
                                        TaskComponent tempTaskComponent = result.get(pathCompId);
                                        if (tempTaskComponent == null) {
//                                            logger.info("tempTaskComponent is null for pathCompId : {}", pathCompId);
                                            continue;
                                        }
                                        PathComponentDetails pathComponentDetails = new PathComponentDetails();
                                        pathComponentDetails.setAppId(taskApplication.getId());
                                        pathComponentDetails.setComponent(pathComponent);
                                        pathComponentDetails.setPath(path.getName());
                                        pathComponentDetails.setComponentId(pathCompId);
                                        tempTaskComponent.getAppDetails().add(pathComponentDetails);
                                        result.put(pathCompId, tempTaskComponent);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            finalTaskComponents.setTaskComponent(result);
        } catch (Exception e) {
            logger.info("Exception in generating taskComponent : {}, {}", e);
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        taskConfigDB.setTaskComponents(finalTaskComponents.getTaskComponent());
        logger.info("TaskComponents generate success.");
    }
    public static void updateTaskApplication(TaskConfigDB taskConfigDB,
                                             ArrayList<String> taskApplicationsPath) throws TodoException {
        TaskApplications taskApplications = null;
        TaskApplications finalTaskApplications = new TaskApplications();
        ArrayList<TaskApplication> result = new ArrayList<TaskApplication>();
        String parsingPath = null;
        try {
            for (String taskApplicationPath: taskApplicationsPath) {
                parsingPath = taskApplicationPath;
                taskApplications = mapper.readValue(new File(taskApplicationPath), TaskApplications.class);
                if (taskApplications != null) {
                    result.addAll(taskApplications.getTaskApplications());
                } else {
                    logger.info("TaskApplications are null for : {}", parsingPath);
                }
            }
            finalTaskApplications.setTaskApplications(result);
        } catch (IOException e) {
            logger.info("Exception for file : {}, {}", parsingPath, e);
            logger.info("Current working directory is : {}", SystemUtils.getProjectWorkingDirV2());
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        taskConfigDB.setTaskApplications(finalTaskApplications);
        logger.info("TaskApplications load success.");
//        logger.info("TaskApplications loaded with data : {}", finalTaskApplications);
    }
}
