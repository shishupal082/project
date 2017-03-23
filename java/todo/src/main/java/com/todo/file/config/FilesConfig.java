package com.todo.file.config;

import java.util.ArrayList;
import java.util.Map;

/**
 * Created by shishupalkumar on 01/02/17.
 */
public class FilesConfig {
    private ArrayList<String> relativePath;
    private ArrayList<String> uiPath;
    private Map<String, String> pathReplaceString;
    private ArrayList<String> unsupportedFileType;
    private Map<String, String> mimeType;
    private String messageSavePath;

    public ArrayList<String> getUiPath() {
        return uiPath;
    }

    public void setUiPath(ArrayList<String> uiPath) {
        this.uiPath = uiPath;
    }

    public ArrayList<String> getRelativePath() {
        return relativePath;
    }

    public void setRelativePath(ArrayList<String> relativePath) {
        this.relativePath = relativePath;
    }

    public ArrayList<String> getUnsupportedFileType() {
        return unsupportedFileType;
    }

    public void setUnsupportedFileType(ArrayList<String> unsupportedFileType) {
        this.unsupportedFileType = unsupportedFileType;
    }

    public Map<String, String> getPathReplaceString() {
        return pathReplaceString;
    }

    public void setPathReplaceString(Map<String, String> pathReplaceString) {
        this.pathReplaceString = pathReplaceString;
    }

    public Map<String, String> getMimeType() {
        return mimeType;
    }

    public void setMimeType(Map<String, String> mimeType) {
        this.mimeType = mimeType;
    }

    public String getMessageSavePath() {
        return messageSavePath;
    }

    public void setMessageSavePath(String messageSavePath) {
        this.messageSavePath = messageSavePath;
    }
}
