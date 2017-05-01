package com.todo.task.config;

import java.util.Map;

/**
 * Created by shishupalkumar on 17/02/17.
 */
public class TaskApplication {
    private String id;
    private Map<String, String> options;
    private Map<String, String[][]> path;
//    private Object

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Map<String, String> getOptions() {
        return options;
    }

    public void setOptions(Map<String, String> options) {
        this.options = options;
    }

    public Map<String, String[][]> getPath() {
        return path;
    }

    public void setPath(Map<String, String[][]> path) {
        this.path = path;
    }

    @Override
    public String toString() {
        return "TaskApplication{" +
            "id='" + id + '\'' +
            ", options=" + options +
            ", path=" + path +
            '}';
    }
}
