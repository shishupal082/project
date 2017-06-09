package com.todo.task.config.response;

/**
 * Created by shishupalkumar on 09/06/17.
 */
public class TaskComponentDetails {
    private String taskId;
    private String componentId;
    private String component;

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public String getComponentId() {
        return componentId;
    }

    public void setComponentId(String componentId) {
        this.componentId = componentId;
    }

    public String getComponent() {
        return component;
    }

    public void setComponent(String component) {
        this.component = component;
    }

    @Override
    public String toString() {
        return "TaskComponentDetailsV2{" +
            "taskId='" + taskId + '\'' +
            ", componentId='" + componentId + '\'' +
            ", component='" + component + '\'' +
            '}';
    }
}
