package com.todo.task.config;

import java.util.ArrayList;
import java.util.Map;

/**
 * Created by shishupalkumar on 17/02/17.
 */
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
