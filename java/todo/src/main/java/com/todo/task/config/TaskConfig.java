package com.todo.task.config;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;

/**
 * Created by shishupalkumar on 17/02/17.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class TaskConfig {
    private ArrayList<TaskItem> taskItems;
    private Map<String, TaskComponent> taskComponents;
    private TaskApplications taskApplications;
    private String[] taskItemsPath;
    private String[] taskComponentPath;
    private String[] taskApplicationPath;

    public ArrayList<TaskItem> getTaskItems() {
        return taskItems;
    }

    public void setTaskItems(ArrayList<TaskItem> taskItems) {
        this.taskItems = taskItems;
    }

    public Map<String, TaskComponent> getTaskComponents() {
        return taskComponents;
    }

    public void setTaskComponents(Map<String, TaskComponent> taskComponents) {
        this.taskComponents = taskComponents;
    }

    public TaskApplications getTaskApplications() {
        return taskApplications;
    }

    public void setTaskApplications(TaskApplications taskApplications) {
        this.taskApplications = taskApplications;
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
            ", taskApplications=" + taskApplications +
            ", taskItemsPath=" + Arrays.toString(taskItemsPath) +
            ", taskComponentPath=" + Arrays.toString(taskComponentPath) +
            ", taskApplicationPath=" + Arrays.toString(taskApplicationPath) +
            '}';
    }
}
