package com.todo.task.config;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.Arrays;
import java.util.Map;

/**
 * Created by shishupalkumar on 17/02/17.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class TaskConfig {
    private Map<String, TaskItem> taskItems;
    private Map<String, TaskComponent> taskComponents;
    private TaskApplication taskApplication;
    private String[] taskItemsPath;
    private String[] taskComponentPath;
    private String[] taskApplicationPath;

    public Map<String, TaskItem> getTaskItems() {
        return taskItems;
    }

    public void setTaskItems(Map<String, TaskItem> taskItems) {
        this.taskItems = taskItems;
    }

    public Map<String, TaskComponent> getTaskComponents() {
        return taskComponents;
    }

    public void setTaskComponents(Map<String, TaskComponent> taskComponents) {
        this.taskComponents = taskComponents;
    }

    public TaskApplication getTaskApplication() {
        return taskApplication;
    }

    public void setTaskApplication(TaskApplication taskApplication) {
        this.taskApplication = taskApplication;
    }

    public String[] getTaskItemsPath() {
        return taskItemsPath;
    }

    public void setTaskItemsPath(String[] taskItemsPath) {
        this.taskItemsPath = taskItemsPath;
    }

    public String[] getTaskComponentPath() {
        return taskComponentPath;
    }

    public void setTaskComponentPath(String[] taskComponentPath) {
        this.taskComponentPath = taskComponentPath;
    }

    public String[] getTaskApplicationPath() {
        return taskApplicationPath;
    }

    public void setTaskApplicationPath(String[] taskApplicationPath) {
        this.taskApplicationPath = taskApplicationPath;
    }

    @Override
    public String toString() {
        return "TaskConfig{" +
            "taskItems=" + taskItems +
            ", taskComponents=" + taskComponents +
            ", taskApplication=" + taskApplication +
            ", taskItemsPath=" + Arrays.toString(taskItemsPath) +
            ", taskComponentPath=" + Arrays.toString(taskComponentPath) +
            ", taskApplicationPath=" + Arrays.toString(taskApplicationPath) +
            '}';
    }
}
