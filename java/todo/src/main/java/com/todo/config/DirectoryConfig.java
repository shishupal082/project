package com.todo.config;

import java.util.ArrayList;

/**
 * Created by shishupalkumar on 01/02/17.
 */
public class DirectoryConfig {
    private ArrayList<String> relativePath;
    private ArrayList<String> supportedGetFile;
    private ArrayList<String> skipLineBreakFile;

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
}
