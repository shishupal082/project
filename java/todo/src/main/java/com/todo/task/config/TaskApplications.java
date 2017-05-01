package com.todo.task.config;

import java.util.ArrayList;
import java.util.Map;

/**
 * Created by shishupalkumar on 17/02/17.
 */
public class TaskApplications {
    private ArrayList<TaskApplication> taskApplications;

    public ArrayList<TaskApplication> getTaskApplications() {
        return taskApplications;
    }

    public void setTaskApplications(ArrayList<TaskApplication> taskApplications) {
        this.taskApplications = taskApplications;
    }

    public TaskApplication getTaskApplicationByAppId(String appId) {
        if (taskApplications != null && appId != null) {
            for (TaskApplication taskApplication : taskApplications) {
                if (appId.equals(taskApplication.getId())) {
                    return taskApplication;
                }
            }
        }
        return null;
    }
    @Override
    public String toString() {
        return "TaskApplications{" +
            "taskApplications=" + taskApplications +
            '}';
    }
}
