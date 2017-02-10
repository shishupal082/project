package com.todo.config;

import java.util.ArrayList;

/**
 * Created by shishupalkumar on 01/02/17.
 */
public class TodoDirectoryConfig {
    private ArrayList<String> relativePath;
    private ArrayList<String> supportedGetFile;
    private ArrayList<String> skipLineBreakFile;
    private String yamlObject;

    public ArrayList<String> getRelativePath() {
        return relativePath;
    }

    public void setRelativePath(ArrayList<String> relativePath) {
        this.relativePath = relativePath;
    }

    public ArrayList<String> getSupportedGetFile() {
        return supportedGetFile;
    }

    public void setSupportedGetFile(ArrayList<String> supportedGetFile) {
        this.supportedGetFile = supportedGetFile;
    }

    public ArrayList<String> getSkipLineBreakFile() {
        return skipLineBreakFile;
    }

    public void setSkipLineBreakFile(ArrayList<String> skipLineBreakFile) {
        this.skipLineBreakFile = skipLineBreakFile;
    }

    public String getYamlObject() {
        return yamlObject;
    }

    public void setYamlObject(String yamlObject) {
        this.yamlObject = yamlObject;
    }
}
