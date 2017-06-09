package com.todo.task.config.component;

import com.todo.task.config.response.PathComponentDetails;
import com.todo.task.config.response.TaskComponentDetails;

import java.util.ArrayList;

/**
 * Created by shishupalkumar on 09/06/17.
 */
public class TaskComponent {
    private String id;
    private ArrayList<TaskComponentDetails> taskDetails;
    private ArrayList<PathComponentDetails> appDetails;
    public TaskComponent() {
        taskDetails = new ArrayList<TaskComponentDetails>();
        appDetails = new ArrayList<PathComponentDetails>();
    }
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public ArrayList<TaskComponentDetails> getTaskDetails() {
        return taskDetails;
    }

    public void setTaskDetails(ArrayList<TaskComponentDetails> taskDetails) {
        this.taskDetails = taskDetails;
    }

    public ArrayList<PathComponentDetails> getAppDetails() {
        return appDetails;
    }

    public void setAppDetails(ArrayList<PathComponentDetails> appDetails) {
        this.appDetails = appDetails;
    }

    @Override
    public String toString() {
        return "TaskComponent{" +
            "id='" + id + '\'' +
            ", taskDetails=" + taskDetails +
            ", appDetails=" + appDetails +
            '}';
    }
}
