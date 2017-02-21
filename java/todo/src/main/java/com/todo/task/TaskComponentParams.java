package com.todo.task;

/**
 * Created by shishupalkumar on 21/02/17.
 */
public enum  TaskComponentParams {
    ID("id"),
    NAME("name"),
    TASK_ID("taskId"),
    TASK_DETAILS("taskDetails"),
    APPLICATION("application");
    private String name;
    TaskComponentParams(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
