package com.todo.task.config;

/**
 * Created by shishupalkumar on 17/02/17.
 */
public class TaskComponent {
    private String taskItem;
    private String name;

    public String getTaskItem() {
        return taskItem;
    }

    public void setTaskItem(String taskItem) {
        this.taskItem = taskItem;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "TaskComponent{" +
            "taskItem='" + taskItem + '\'' +
            ", name='" + name + '\'' +
            '}';
    }
}
