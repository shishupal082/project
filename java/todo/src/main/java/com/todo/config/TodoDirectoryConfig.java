package com.todo.config;

import java.util.ArrayList;

/**
 * Created by shishupalkumar on 01/02/17.
 */
public class TodoDirectoryConfig {
    private String relativePath;
    private ArrayList<String> supportedGetFile;

    public String getRelativePath() {
        return relativePath;
    }

    public void setRelativePath(String relativePath) {
        this.relativePath = relativePath;
    }

    public ArrayList<String> getSupportedGetFile() {
        return supportedGetFile;
    }

    public void setSupportedGetFile(ArrayList<String> supportedGetFile) {
        this.supportedGetFile = supportedGetFile;
    }
}
