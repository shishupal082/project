package com.todo.config;

import com.todo.file.config.FilesConfig;
import com.todo.task.config.TaskConfig;

import java.util.ArrayList;

/**
 * Created by shishupalkumar on 18/05/17.
 */
public class AppConfig {
    private TaskConfig taskConfig;
    private FilesConfig filesConfig;

    private ArrayList<String> taskItemsPath;
    private ArrayList<String> taskApplicationPath;
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

    public ArrayList<String> getTaskItemsPath() {
        return taskItemsPath;
    }

    public void setTaskItemsPath(ArrayList<String> taskItemsPath) {
        this.taskItemsPath = taskItemsPath;
    }

    public ArrayList<String> getTaskApplicationPath() {
        return taskApplicationPath;
    }

    public void setTaskApplicationPath(ArrayList<String> taskApplicationPath) {
        this.taskApplicationPath = taskApplicationPath;
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
    public void merge(AppConfig tempAppConfig) {
        if (tempAppConfig.getTaskItemsPath() != null) {
            if (this.getTaskItemsPath() != null) {
                this.getTaskItemsPath().addAll(tempAppConfig.getTaskItemsPath());
            } else {
                this.setTaskItemsPath(tempAppConfig.getTaskItemsPath());
            }
        }
        if (tempAppConfig.getTaskApplicationPath() != null) {
            if (this.getTaskApplicationPath() != null) {
                this.getTaskApplicationPath().addAll(tempAppConfig.getTaskApplicationPath());
            } else {
                this.setTaskApplicationPath(tempAppConfig.getTaskApplicationPath());
            }
        }
        if (tempAppConfig.getUiPath() != null) {
            if (this.getUiPath() != null) {
                this.getUiPath().addAll(tempAppConfig.getUiPath());
            } else {
                this.setUiPath(tempAppConfig.getUiPath());
            }
        }
        if (tempAppConfig.getRelativePath() != null) {
            if (this.getRelativePath() != null) {
                this.getRelativePath().addAll(tempAppConfig.getRelativePath());
            } else {
                this.setRelativePath(tempAppConfig.getRelativePath());
            }
        }
        if (tempAppConfig.getResourcePath() != null) {
            this.setResourcePath(tempAppConfig.getResourcePath());
        }
        if (tempAppConfig.getMessageSavePath() != null) {
            this.setMessageSavePath(tempAppConfig.getMessageSavePath());
        }
        if (tempAppConfig.getAddTextPath() != null) {
            this.setAddTextPath(tempAppConfig.getAddTextPath());
        }
    }
    @Override
    public String toString() {
        return "AppConfig{" +
            "taskConfig=" + taskConfig +
            ", filesConfig=" + filesConfig +
            ", taskItemsPath=" + taskItemsPath +
            ", taskApplicationPath=" + taskApplicationPath +
            ", relativePath=" + relativePath +
            ", uiPath=" + uiPath +
            ", messageSavePath='" + messageSavePath + '\'' +
            ", resourcePath='" + resourcePath + '\'' +
            ", addTextPath='" + addTextPath + '\'' +
            '}';
    }
}
