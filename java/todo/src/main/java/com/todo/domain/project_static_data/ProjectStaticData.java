package com.todo.domain.project_static_data;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;
import java.util.HashMap;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ProjectStaticData {
    private HashMap<String, String> fileMapping;
    private ArrayList<ProjectData> projectData;

    public HashMap<String, String> getFileMapping() {
        return fileMapping;
    }

    public void setFileMapping(HashMap<String, String> fileMapping) {
        this.fileMapping = fileMapping;
    }


    public ArrayList<ProjectData> getProjectData() {
        return projectData;
    }

    public void setProjectData(ArrayList<ProjectData> projectData) {
        this.projectData = projectData;
    }

    public void merge(ProjectStaticData tempProjectStaticData) {
        if (tempProjectStaticData.getFileMapping() != null) {
            if (this.getFileMapping() != null) {
                this.getFileMapping().putAll(tempProjectStaticData.getFileMapping());
            } else {
                this.setFileMapping(tempProjectStaticData.getFileMapping());
            }
        }
        if (tempProjectStaticData.getProjectData() != null) {
            if (this.getProjectData() != null) {
                this.getProjectData().addAll(tempProjectStaticData.getProjectData());
            } else {
                this.setProjectData(tempProjectStaticData.getProjectData());
            }
        }
    }

    @Override
    public String toString() {
        return "ProjectStaticData{" +
                "fileMapping=" + fileMapping +
                ", projectData=" + projectData +
                '}';
    }
}
