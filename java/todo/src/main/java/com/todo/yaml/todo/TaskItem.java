package com.todo.yaml.todo;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
/**
 * Created by shishupalkumar on 17/02/17.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class TaskItem {
    private String id;
    private String[] component;
    private Map<String, String> options;
    private ArrayList<Map<String, String>> history;

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

    public ArrayList<Map<String, String>> getHistory() {
        return history;
    }

    public void setHistory(ArrayList<Map<String, String>> history) {
        this.history = history;
    }

    @Override
    public String toString() {
        return "TaskItem{" +
            "id='" + id + '\'' +
            ", component=" + Arrays.toString(component) +
            ", options=" + options +
            ", history=" + history +
            '}';
    }
}
