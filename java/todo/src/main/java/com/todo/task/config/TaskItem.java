package com.todo.task.config;

import java.util.Arrays;

/**
 * Created by shishupalkumar on 17/02/17.
 */
public class TaskItem {
    private String name;
    private String place;
    private String[] component;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPlace() {
        return place;
    }

    public void setPlace(String place) {
        this.place = place;
    }

    public String[] getComponent() {
        return component;
    }

    public void setComponent(String[] component) {
        this.component = component;
    }

    @Override
    public String toString() {
        return "TaskItem{" +
            "name='" + name + '\'' +
            ", place='" + place + '\'' +
            ", component=" + Arrays.toString(component) +
            '}';
    }
}
