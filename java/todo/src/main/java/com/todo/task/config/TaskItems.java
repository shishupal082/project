package com.todo.task.config;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by shishupalkumar on 17/02/17.
 */
public class TaskItems {
    private Map<String, TaskItem> taskItems;

    public Map<String, TaskItem> getTaskItems() {
        return taskItems;
    }

    public void setTaskItems(Map<String, TaskItem> taskItems) {
        this.taskItems = taskItems;
    }

    @Override
    public String toString() {
        return "TaskItems{" +
            "taskItems=" + taskItems +
            '}';
    }
}
