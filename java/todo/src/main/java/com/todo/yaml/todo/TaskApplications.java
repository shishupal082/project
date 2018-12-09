package com.todo.yaml.todo;

import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Created by shishupalkumar on 17/02/17.
 */

@JsonIgnoreProperties(ignoreUnknown = true)

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
