package com.todo.task.config;

import com.todo.task.config.component.TaskComponent;
import com.todo.yaml.todo.TaskApplications;
import com.todo.yaml.todo.TaskItem;

import java.util.ArrayList;
import java.util.Map;

/**
 * Created by shishupalkumar on 17/02/17.
 */

public class TaskConfig {
    private ArrayList<TaskItem> taskItems;
    private Map<String, TaskComponent> taskComponents;
    private TaskApplications taskApplications;

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

    @Override
    public String toString() {
        return "TaskConfig{" +
                "taskItems=" + taskItems +
                ", taskComponents=" + taskComponents +
                ", taskApplications=" + taskApplications +
                '}';
    }
}
