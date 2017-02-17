package com.todo.task.config;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Created by shishupalkumar on 17/02/17.
 */
public class TaskComponent {
    private String name;
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String taskItem;

    public String getTaskItem() {
        return taskItem;
    }

    public void setTaskItem(String taskItem) {
        this.taskItem = taskItem;
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
            "taskItem='" + taskItem + '\'' +
            ", name='" + name + '\'' +
            '}';
    }
}
