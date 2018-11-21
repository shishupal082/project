package com.todo.domain.project_static_data;

import java.util.ArrayList;
import java.util.HashMap;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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
        if (fileMapping != null && tempProjectStaticData.getFileMapping() != null) {
            fileMapping.putAll(tempProjectStaticData.getFileMapping());
        } else {
            fileMapping = tempProjectStaticData.getFileMapping();
        }
        if (projectData != null && tempProjectStaticData.getProjectData() != null) {
            projectData.addAll(tempProjectStaticData.getProjectData());
        } else {
            projectData = tempProjectStaticData.getProjectData();
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
