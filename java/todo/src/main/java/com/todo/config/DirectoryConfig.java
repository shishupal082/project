package com.todo.config;

import java.util.ArrayList;
import java.util.Map;

/**
 * Created by shishupalkumar on 12/05/17.
 */
public class DirectoryConfig {
    private Map<String, String> pathReplaceString;
    private ArrayList<String> unsupportedFileType;
    private Map<String, String> mimeType;
    public ArrayList<String> getUnsupportedFileType() {
        return unsupportedFileType;
    }

    public void setUnsupportedFileType(ArrayList<String> unsupportedFileType) {
        this.unsupportedFileType = unsupportedFileType;
    }
    public Map<String, String> getMimeType() {
        return mimeType;
    }

    public void setMimeType(Map<String, String> mimeType) {
        this.mimeType = mimeType;
    }

    public Map<String, String> getPathReplaceString() {
        return pathReplaceString;
    }

    public void setPathReplaceString(Map<String, String> pathReplaceString) {
        this.pathReplaceString = pathReplaceString;
    }
}
