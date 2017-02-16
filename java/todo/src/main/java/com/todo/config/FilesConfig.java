package com.todo.config;

import java.util.ArrayList;

/**
 * Created by shishupalkumar on 01/02/17.
 */
public class FilesConfig {
    private ArrayList<String> relativePath;
    private ArrayList<String> imageType;
    private ArrayList<String> textType;
    private ArrayList<String> applicationType;
    private ArrayList<String> unsupportedType;
    public ArrayList<String> getRelativePath() {
        return relativePath;
    }

    public void setRelativePath(ArrayList<String> relativePath) {
        this.relativePath = relativePath;
    }

    public ArrayList<String> getApplicationType() {
        return applicationType;
    }

    public void setApplicationType(ArrayList<String> applicationType) {
        this.applicationType = applicationType;
    }

    public ArrayList<String> getImageType() {
        return imageType;
    }

    public void setImageType(ArrayList<String> imageType) {
        this.imageType = imageType;
    }

    public ArrayList<String> getTextType() {
        return textType;
    }

    public void setTextType(ArrayList<String> textType) {
        this.textType = textType;
    }

    public ArrayList<String> getUnsupportedType() {
        return unsupportedType;
    }

    public void setUnsupportedType(ArrayList<String> unsupportedType) {
        this.unsupportedType = unsupportedType;
    }
}
