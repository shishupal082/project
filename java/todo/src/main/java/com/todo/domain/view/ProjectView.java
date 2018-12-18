package com.todo.domain.view;

import com.todo.constants.AppConstant;
import com.todo.domain.ProjectViewParams;
import com.todo.domain.project_static_data.ProjectData;
import com.todo.domain.project_static_data.ProjectPath;
import com.todo.domain.project_static_data.ProjectStaticData;
import io.dropwizard.views.View;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;

public class ProjectView extends View {
    private static Logger logger = LoggerFactory.getLogger(ProjectView.class);
    private ProjectViewParams projectViewParams;
    private ArrayList<String> getStaticFiles(ArrayList<String> requiredFiles,
                                             ProjectStaticData projectStaticData) {
        ArrayList<String> staticFiles = new ArrayList<String>();
        HashMap<String, String> fileMapping = null;
        if (projectStaticData != null && projectStaticData.getFileMapping() != null) {
            fileMapping = projectStaticData.getFileMapping();
        }
        if (fileMapping != null && requiredFiles != null) {
            for(String fileName : requiredFiles) {
                if (fileMapping.get(fileName) != null) {
                    staticFiles.add(fileMapping.get(fileName));
                } else {
                    logger.info("Static file not found for : {}", fileName);
                }
            }
        }
        return staticFiles;
    }
    private ProjectData getCurrentProjectData(String projectViewVersion,
                                          ArrayList<String> params,
                                          ProjectStaticData projectStaticData) {
        ArrayList<ProjectData> projectDatas = new ArrayList<ProjectData>();
        if (projectStaticData != null) {
            if (projectStaticData.getProjectData() != null) {
                projectDatas = projectStaticData.getProjectData();
            }
        }
        String currentUrl = "";
        ProjectData currentProjectData = null;
        for(ProjectData projectData : projectDatas) {
            currentUrl = "";
            if (AppConstant.ProjectDashboard.equals(projectViewVersion)) {
                if (AppConstant.ProjectDashboard.equals(projectData.getVersion())) {
                    currentProjectData = projectData;
                    break;
                }
                continue;
            }
            if (projectData.getPattern() != null) {
                for (String pattern : projectData.getPattern()) {
                    Integer index = -1;
                    try {
                        index = ProjectPath.valueOf(pattern).ordinal();
                    } catch (Exception e) {
                        logger.info("Invalid pattern found in projectData : {}", pattern);
                    }
                    if (index > -1 && params.size() > index) {
                        try {
                            currentUrl += URLEncoder.encode(params.get(index), "UTF-8");
                        } catch (Exception e) {
                            currentUrl += params.get(index);
                        }
                    }
                }
            }
            if (projectData.getPatternParams() != null) {
                //Fix for java-1.7.1
                String urlParams = "";//String.join("", projectData.getPatternParams());
                for (String pathParam : projectData.getPatternParams()) {
                    urlParams += pathParam;
                }
                if (urlParams.equals(currentUrl)) {
                    currentProjectData = projectData;
                    break;
                }
            }
        }
        return currentProjectData;
    }
    public ProjectView(HttpServletRequest httpServletRequest, String projectViewVersion,
                       ArrayList<String> params, ProjectStaticData projectStaticData) {
        super("project.ftl");
        projectViewParams = new ProjectViewParams();
        projectViewParams.setVersion(projectViewVersion);
        projectViewParams.setPathParams(params);
        projectViewParams.setTitle("Project View");
        projectViewParams.setConfig("");
        projectViewParams.setHtml("");
        projectViewParams.setProjectNotFound(false);
        ProjectData currentProjectData = getCurrentProjectData(projectViewVersion,
                params, projectStaticData);
        logger.info("Project data for {}, {}", params, currentProjectData);
        ArrayList<String> cssFiles = new ArrayList<String>();
        ArrayList<String> jsFiles = new ArrayList<String>();
        if (params == null) {
            projectViewParams.setPathParams(new ArrayList<String>());
        }
        if (currentProjectData != null) {
            if (currentProjectData.getTitle() != null) {
                projectViewParams.setTitle(currentProjectData.getTitle());
            }
            if (currentProjectData.getConfig() != null) {
                projectViewParams.setConfig(currentProjectData.getConfig());
            }
            if (currentProjectData.getHtml() != null) {
                projectViewParams.setHtml(currentProjectData.getHtml());
            }
            if (currentProjectData.getCssFiles() != null) {
                cssFiles = currentProjectData.getCssFiles();
            }
            if (currentProjectData.getJsFiles() != null) {
                jsFiles = currentProjectData.getJsFiles();
            }
        } else {
            projectViewParams.setTitle("Page Not Found.");
            projectViewParams.setProjectNotFound(true);
            cssFiles.add("bootstrap-3.3.7-css");
            logger.info("Page not found.");
        }
        projectViewParams.setCssFiles(getStaticFiles(cssFiles, projectStaticData));
        projectViewParams.setJsFiles(getStaticFiles(jsFiles, projectStaticData));
    }

    public ProjectViewParams getProjectViewParams() {
        return projectViewParams;
    }
}
