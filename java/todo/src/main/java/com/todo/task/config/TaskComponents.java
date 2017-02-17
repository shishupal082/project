package com.todo.task.config;

import java.util.Map;

/**
 * Created by shishupalkumar on 17/02/17.
 */
public class TaskComponents {
    private Map<String, TaskComponent> taskComponents;

    public Map<String, TaskComponent> getTaskComponents() {
        return taskComponents;
    }

    public void setTaskComponents(Map<String, TaskComponent> taskComponents) {
        this.taskComponents = taskComponents;
    }

    @Override
    public String toString() {
        return "TaskComponents{" +
            "taskComponents=" + taskComponents +
            '}';
    }
}
