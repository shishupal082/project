package com.todo.domain;

import java.util.ArrayList;

public class ProjectViewParams {
    private String version;
    private String title;
    private String config;
    private String html;
    private ArrayList<String> pathParams;
    private ArrayList<String> cssFiles;
    private ArrayList<String> jsFiles;
    private Boolean projectNotFound;

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getConfig() {
        return config;
    }

    public void setConfig(String config) {
        this.config = config;
    }

    public String getHtml() {
        return html;
    }

    public void setHtml(String html) {
        this.html = html;
    }

    public ArrayList<String> getPathParams() {
        return pathParams;
    }

    public void setPathParams(ArrayList<String> pathParams) {
        this.pathParams = pathParams;
    }

    public ArrayList<String> getCssFiles() {
        return cssFiles;
    }

    public void setCssFiles(ArrayList<String> cssFiles) {
        this.cssFiles = cssFiles;
    }

    public ArrayList<String> getJsFiles() {
        return jsFiles;
    }

    public void setJsFiles(ArrayList<String> jsFiles) {
        this.jsFiles = jsFiles;
    }

    public Boolean getProjectNotFound() {
        return projectNotFound;
    }

    public void setProjectNotFound(Boolean projectNotFound) {
        this.projectNotFound = projectNotFound;
    }

    @Override
    public String toString() {
        return "ProjectViewParams{" +
                "version='" + version + '\'' +
                ", title='" + title + '\'' +
                ", config='" + config + '\'' +
                ", html='" + html + '\'' +
                ", pathParams=" + pathParams +
                ", cssFiles=" + cssFiles +
                ", jsFiles=" + jsFiles +
                ", projectNotFound=" + projectNotFound +
                '}';
    }
}
