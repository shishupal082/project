package com.todo.config;

import com.todo.file.config.FilesConfig;
import com.todo.task.config.TaskConfig;

import java.util.ArrayList;

/**
 * Created by shishupalkumar on 18/05/17.
 */
public class AppConfig {
    private TaskConfig taskConfig;
    public FilesConfig filesConfig;

    private String[] taskItemsPath;
    private String[] taskComponentPath;
    private String[] taskApplicationPath;
    private String[] taskHistoryPath;
    private ArrayList<String> relativePath;
    private ArrayList<String> uiPath;
    private String messageSavePath;

    public TaskConfig getTaskConfig() {
        return taskConfig;
    }

    public void setTaskConfig(TaskConfig taskConfig) {
        this.taskConfig = taskConfig;
    }

    public FilesConfig getFilesConfig() {
        return filesConfig;
    }

    public void setFilesConfig(FilesConfig filesConfig) {
        this.filesConfig = filesConfig;
    }

    public String[] getTaskItemsPath() {
        return taskItemsPath;
    }

    public void setTaskItemsPath(String[] taskItemsPath) {
        this.taskItemsPath = taskItemsPath;
    }

    public String[] getTaskComponentPath() {
        return taskComponentPath;
    }

    public void setTaskComponentPath(String[] taskComponentPath) {
        this.taskComponentPath = taskComponentPath;
    }

    public String[] getTaskApplicationPath() {
        return taskApplicationPath;
    }

    public void setTaskApplicationPath(String[] taskApplicationPath) {
        this.taskApplicationPath = taskApplicationPath;
    }

    public String[] getTaskHistoryPath() {
        return taskHistoryPath;
    }

    public void setTaskHistoryPath(String[] taskHistoryPath) {
        this.taskHistoryPath = taskHistoryPath;
    }

    public ArrayList<String> getRelativePath() {
        return relativePath;
    }

    public void setRelativePath(ArrayList<String> relativePath) {
        this.relativePath = relativePath;
    }

    public ArrayList<String> getUiPath() {
        return uiPath;
    }

    public void setUiPath(ArrayList<String> uiPath) {
        this.uiPath = uiPath;
    }

    public String getMessageSavePath() {
        return messageSavePath;
    }

    public void setMessageSavePath(String messageSavePath) {
        this.messageSavePath = messageSavePath;
    }
}
