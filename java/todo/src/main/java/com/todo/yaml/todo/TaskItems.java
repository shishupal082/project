package com.todo.yaml.todo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;
/**
 * Created by shishupalkumar on 17/02/17.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class TaskItems {
    private ArrayList<TaskItem> taskItems;

    public ArrayList<TaskItem> getTaskItems() {
        return taskItems;
    }

    public void setTaskItems(ArrayList<TaskItem> taskItems) {
        this.taskItems = taskItems;
    }

    @Override
    public String toString() {
        return "TaskItems{" +
            "taskItems=" + taskItems +
            '}';
    }
}
