package com.todo.config;

import com.todo.file.config.FilesConfig;
import com.todo.task.config.TaskConfig;

import java.util.ArrayList;
import java.util.Arrays;

/**
 * Created by shishupalkumar on 18/05/17.
 */
public class AppConfig {
    private TaskConfig taskConfig;
    private FilesConfig filesConfig;

    private String[] taskItemsPath;
    private String[] taskComponentPath;
    private String[] taskApplicationPath;
    private String[] taskHistoryPath;
    private ArrayList<String> relativePath;
    private ArrayList<String> uiPath;
    private String messageSavePath;
    private String resourcePath;
    private String addTextPath;


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

    public String getResourcePath() {
        return resourcePath;
    }

    public void setResourcePath(String resourcePath) {
        this.resourcePath = resourcePath;
    }

    public String getAddTextPath() {
        return addTextPath;
    }

    public void setAddTextPath(String addTextPath) {
        this.addTextPath = addTextPath;
    }

    @Override
    public String toString() {
        return "AppConfig{" +
            "taskConfig=" + taskConfig +
            ", filesConfig=" + filesConfig +
            ", taskItemsPath=" + Arrays.toString(taskItemsPath) +
            ", taskComponentPath=" + Arrays.toString(taskComponentPath) +
            ", taskApplicationPath=" + Arrays.toString(taskApplicationPath) +
            ", taskHistoryPath=" + Arrays.toString(taskHistoryPath) +
            ", relativePath=" + relativePath +
            ", uiPath=" + uiPath +
            ", messageSavePath='" + messageSavePath + '\'' +
            ", resourcePath='" + resourcePath + '\'' +
            ", addTextPath='" + addTextPath + '\'' +
            '}';
    }
}
