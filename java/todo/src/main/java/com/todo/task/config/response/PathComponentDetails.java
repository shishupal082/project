package com.todo.task.config.response;

/**
 * Created by shishupalkumar on 09/06/17.
 */
public class PathComponentDetails {
    private String appId;
    private String path;
    private String component;
    private String componentId;

    public String getAppId() {
        return appId;
    }

    public void setAppId(String appId) {
        this.appId = appId;
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

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    @Override
    public String toString() {
        return "PathComponentDetails{" +
            "appId='" + appId + '\'' +
            ", componentId='" + componentId + '\'' +
            ", component='" + component + '\'' +
            ", path='" + path + '\'' +
            '}';
    }
}
