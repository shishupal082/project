package com.todo.domain.project_static_data;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ProjectData {
    private String version;
    private String title;
    private String config;
    private String html;
    private ArrayList<String> pattern;
    private ArrayList<String> patternParams;
    private ArrayList<String> cssFiles;
    private ArrayList<String> jsFiles;

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

    public ArrayList<String> getPattern() {
        return pattern;
    }

    public void setPattern(ArrayList<String> pattern) {
        this.pattern = pattern;
    }

    public ArrayList<String> getPatternParams() {
        return patternParams;
    }

    public void setPatternParams(ArrayList<String> patternParams) {
        this.patternParams = patternParams;
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

    @Override
    public String toString() {
        return "ProjectData{" +
                "version='" + version + '\'' +
                ", title='" + title + '\'' +
                ", config='" + config + '\'' +
                ", html='" + html + '\'' +
                ", pattern=" + pattern +
                ", patternParams=" + patternParams +
                ", cssFiles=" + cssFiles +
                ", jsFiles=" + jsFiles +
                '}';
    }
}
