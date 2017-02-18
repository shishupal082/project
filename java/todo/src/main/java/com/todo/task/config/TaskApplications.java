package com.todo.task.config;

import java.util.Map;

/**
 * Created by shishupalkumar on 17/02/17.
 */
public class TaskApplications {
    private Map<String, Map<String, String[][]>> taskApplications;

    public Map<String, Map<String, String[][]>> getTaskApplications() {
        return taskApplications;
    }

    public void setTaskApplications(Map<String, Map<String, String[][]>> taskApplications) {
        this.taskApplications = taskApplications;
    }

    @Override
    public String toString() {
        return "TaskApplications{" +
                "taskApplications=" + taskApplications +
                '}';
    }
}
