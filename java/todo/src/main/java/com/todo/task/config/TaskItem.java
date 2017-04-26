package com.todo.task.config;

import java.util.Arrays;
import java.util.Map;

/**
 * Created by shishupalkumar on 17/02/17.
 */
public class TaskItem {
    private String id;
    private String[] component;
    private Map<String, String> options;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String[] getComponent() {
        return component;
    }

    public void setComponent(String[] component) {
        this.component = component;
    }

    public Map<String, String> getOptions() {
        return options;
    }

    public void setOptions(Map<String, String> options) {
        this.options = options;
    }

    @Override
    public String toString() {
        return "TaskItem{" +
            "id='" + id + '\'' +
            ", component=" + Arrays.toString(component) +
            ", options=" + options +
            '}';
    }
}
