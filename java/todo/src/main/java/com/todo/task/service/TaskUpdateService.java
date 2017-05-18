package com.todo.task.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.todo.parser.string_parser.StringParser;
import com.todo.services.ConfigService;
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
 * Created by shishupalkumar on 18/05/17.
 */
public class TaskUpdateService {
    private static Logger logger = LoggerFactory.getLogger(TaskUpdateService.class);
    private static ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
    public static void updateTaskItems(TaskConfig taskConfig, String[] taskItemsPath) throws TodoException {
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
            ArrayList<String> tempTaskIds = new ArrayList<String>();
            for (TaskItem tempTaskItem: finalTaskItems.getTaskItems()) {
                if (tempTaskIds.contains(tempTaskItem.getId())) {
                    logger.info("Duplicate entry found for taskId : {}, {}, {}",
                        tempTaskItem.getId(), tempTaskItem, tempTaskIds);
                    throw new TodoException(ErrorCodes.DUPLICATE_ENTRY);
                } else {
                    tempTaskIds.add(tempTaskItem.getId());
                }
            }
        } catch (IOException e) {
            logger.info("Exception for file : {}, {}", parsingPath, e);
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        taskConfig.setTaskItems(finalTaskItems.getTaskItems());
        logger.info("TaskItems loaded with data : {}", finalTaskItems);
    }
    public static void updateTaskComponents(TaskConfig taskConfig, String[] taskComponentsPath) throws TodoException {
        TaskComponents taskComponents = null;
        TaskComponents finalTaskComponents = new TaskComponents();
        Map<String, TaskComponent> result = new HashMap<String, TaskComponent>();
        String parsingPath = null;
        try {
            ArrayList<TaskItem> tempTaskItems = taskConfig.getTaskItems();
            Map<String, String> componentIdVsTaskId = new HashMap<String, String>();
            for(TaskItem taskItem : tempTaskItems) {
                if (taskItem.getComponent() == null) {
                    logger.info("Component not found : {}", taskItem);
                    continue;
                }
                for (String componentId : taskItem.getComponent()) {
                    String compId = (String) new StringParser(componentId).getValue("id");
                    if (componentIdVsTaskId.containsKey(compId)) {
                        logger.info("Duplicate entry found for componentId : {}, {}", compId, taskItem);
                        throw new TodoException(ErrorCodes.DUPLICATE_ENTRY);
                    }
                    componentIdVsTaskId.put(compId, taskItem.getId());
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
    public static void updateTaskApplication(TaskConfig taskConfig,
                                              String[] taskApplicationsPath) throws TodoException {
        TaskApplications taskApplications = null;
        TaskApplications finalTaskApplications = new TaskApplications();
        ArrayList<TaskApplication> result = new ArrayList<TaskApplication>();
        String parsingPath = null;
        try {
            for (String taskApplicationPath: taskApplicationsPath) {
                parsingPath = taskApplicationPath;
                taskApplications = mapper.readValue(new File(taskApplicationPath), TaskApplications.class);
                result.addAll(taskApplications.getTaskApplications());
            }
            finalTaskApplications.setTaskApplications(result);
        } catch (IOException e) {
            logger.info("Exception for file : {}, {}", parsingPath, e);
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        taskConfig.setTaskApplications(finalTaskApplications);
        logger.info("TaskApplications loaded with data : {}", finalTaskApplications);
    }
}
