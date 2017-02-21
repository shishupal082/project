package com.todo.task.config;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Created by shishupalkumar on 17/02/17.
 */
public class TaskComponent {
    private String name;
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String taskId;

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "TaskComponent{" +
            "taskId='" + taskId + '\'' +
            ", name='" + name + '\'' +
            '}';
    }
}
