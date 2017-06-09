package com.todo.task.config;

import com.todo.task.config.component.TaskComponent;

import java.util.Map;

/**
 * Created by shishupalkumar on 17/02/17.
 */
public class TaskComponents {
    private Map<String, TaskComponent> taskComponent;

    public Map<String, TaskComponent> getTaskComponent() {
        return taskComponent;
    }

    public void setTaskComponent(Map<String, TaskComponent> taskComponent) {
        this.taskComponent = taskComponent;
    }

    @Override
    public String toString() {
        return "TaskComponents{" +
            "taskComponent=" + taskComponent +
            '}';
    }
}
