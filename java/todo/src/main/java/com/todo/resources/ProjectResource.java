package com.todo.resources;

import com.todo.TodoConfiguration;
import com.todo.constants.AppConstant;
import com.todo.domain.project_static_data.ProjectStaticData;
import com.todo.domain.view.ProjectView;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import java.util.ArrayList;

@Path("/project")
public class ProjectResource {
    private static Logger logger = LoggerFactory.getLogger(ProjectResource.class);
    private HttpServletRequest httpServletRequest;
    private TodoConfiguration todoConfiguration;
    public ProjectResource(TodoConfiguration todoConfiguration) {
        this.todoConfiguration = todoConfiguration;
    }
    @GET
    public ProjectView loadProjectView() {
        logger.info("loadProjectView : In");
        ArrayList<String> pathParam = new ArrayList<String>();
        ProjectStaticData projectStaticData = todoConfiguration.getConfigInterface().getProjectStaticData(
                todoConfiguration.getConfigInterface().getAppConfig());
        ProjectView projectView = new ProjectView(httpServletRequest,
                AppConstant.ProjectDashboard, pathParam, projectStaticData);
        logger.info("loadProjectView : Out");

        return projectView;
    }
    @Path("/{p0}")
    @GET
    public ProjectView loadProjectViewV0(@PathParam("p0") String p0) {
        logger.info("loadProjectViewV0 : In");
        ArrayList<String> pathParam = new ArrayList<String>();
        pathParam.add(p0);
        logger.info("Pathparameters : {}", pathParam);
        ProjectStaticData projectStaticData = todoConfiguration.getConfigInterface().getProjectStaticData(
                todoConfiguration.getConfigInterface().getAppConfig());
        ProjectView projectView = new ProjectView(httpServletRequest,
                "v0", pathParam, projectStaticData);
        logger.info("loadProjectViewV0 : Out");
        return projectView;
    }
    @Path("/{p0}/{p1}")
    @GET
    public ProjectView loadProjectViewV1(@PathParam("p0") String p0, @PathParam("p1") String p1) {
        logger.info("loadProjectViewV1 : In");
        ArrayList<String> pathParam = new ArrayList<String>();
        pathParam.add(p0);
        pathParam.add(p1);
        logger.info("Pathparameters : {}", pathParam);
        ProjectStaticData projectStaticData = todoConfiguration.getConfigInterface().getProjectStaticData(
                todoConfiguration.getConfigInterface().getAppConfig());
        ProjectView projectView = new ProjectView(httpServletRequest,
                "v1", pathParam, projectStaticData);
        logger.info("loadProjectViewV1 : Out");
        return projectView;
    }
    @Path("/{p0}/{p1}/{p2}")
    @GET
    public ProjectView loadProjectViewV2(@PathParam("p0") String p0,
                                         @PathParam("p1") String p1, @PathParam("p2") String p2) {
        logger.info("loadProjectViewV2 : In");
        ArrayList<String> pathParam = new ArrayList<String>();
        pathParam.add(p0);
        pathParam.add(p1);
        pathParam.add(p2);
        logger.info("Pathparameters : {}", pathParam);
        ProjectStaticData projectStaticData = todoConfiguration.getConfigInterface().getProjectStaticData(
                todoConfiguration.getConfigInterface().getAppConfig());
        ProjectView projectView = new ProjectView(httpServletRequest,
                "v2", pathParam, projectStaticData);
        logger.info("loadProjectViewV2 : Out");
        return projectView;
    }
    @Path("/{p0}/{p1}/{p2}/{p3}")
    @GET
    public ProjectView loadProjectViewV3(@PathParam("p0") String p0, @PathParam("p1") String p1,
                                         @PathParam("p2") String p2, @PathParam("p3") String p3) {
        logger.info("loadProjectViewV3 : In");
        ArrayList<String> pathParam = new ArrayList<String>();
        pathParam.add(p0);
        pathParam.add(p1);
        pathParam.add(p2);
        pathParam.add(p3);
        logger.info("Pathparameters : {}", pathParam);
        ProjectStaticData projectStaticData = todoConfiguration.getConfigInterface().getProjectStaticData(
                todoConfiguration.getConfigInterface().getAppConfig());
        ProjectView projectView = new ProjectView(httpServletRequest,
                "v3", pathParam, projectStaticData);
        logger.info("loadProjectViewV3 : Out");
        return projectView;
    }
    @Path("/{p0}/{p1}/{p2}/{p3}/{p4}")
    @GET
    public ProjectView loadProjectViewV4(@PathParam("p0") String p0, @PathParam("p1") String p1,
                                         @PathParam("p2") String p2, @PathParam("p3") String p3,
                                         @PathParam("p4") String p4) {
        logger.info("loadProjectViewV4 : In");
        ArrayList<String> pathParam = new ArrayList<String>();
        pathParam.add(p0);
        pathParam.add(p1);
        pathParam.add(p2);
        pathParam.add(p3);
        pathParam.add(p4);
        logger.info("Pathparameters : {}", pathParam);
        ProjectStaticData projectStaticData = todoConfiguration.getConfigInterface().getProjectStaticData(
                todoConfiguration.getConfigInterface().getAppConfig());
        ProjectView projectView = new ProjectView(httpServletRequest,
                "v4", pathParam, projectStaticData);
        logger.info("loadProjectViewV4 : Out");
        return projectView;
    }
    @Path("/{p0}/{p1}/{p2}/{p3}/{p4}/{p5}")
    @GET
    public ProjectView loadProjectViewV6(@PathParam("p0") String p0, @PathParam("p1") String p1,
                                         @PathParam("p2") String p2, @PathParam("p3") String p3,
                                         @PathParam("p4") String p4, @PathParam("p5") String p5) {
        logger.info("loadProjectViewV5 : In");
        ArrayList<String> pathParam = new ArrayList<String>();
        pathParam.add(p0);
        pathParam.add(p1);
        pathParam.add(p2);
        pathParam.add(p3);
        pathParam.add(p4);
        pathParam.add(p5);
        logger.info("Pathparameters : {}", pathParam);
        ProjectStaticData projectStaticData = todoConfiguration.getConfigInterface().getProjectStaticData(
                todoConfiguration.getConfigInterface().getAppConfig());
        ProjectView projectView = new ProjectView(httpServletRequest,
                "v5", pathParam, projectStaticData);
        logger.info("loadProjectViewV5 : Out");
        return projectView;
    }
    @Path("/{p0}/{p1}/{p2}/{p3}/{p4}/{p5}/{p6}")
    @GET
    public ProjectView loadProjectViewV6(@PathParam("p0") String p0, @PathParam("p1") String p1,
                                         @PathParam("p2") String p2, @PathParam("p3") String p3,
                                         @PathParam("p4") String p4, @PathParam("p5") String p5,
                                         @PathParam("p6") String p6) {
        logger.info("loadProjectViewV6 : In");
        ArrayList<String> pathParam = new ArrayList<String>();
        pathParam.add(p0);
        pathParam.add(p1);
        pathParam.add(p2);
        pathParam.add(p3);
        pathParam.add(p4);
        pathParam.add(p5);
        pathParam.add(p6);
        logger.info("Pathparameters : {}", pathParam);
        ProjectStaticData projectStaticData = todoConfiguration.getConfigInterface().getProjectStaticData(
                todoConfiguration.getConfigInterface().getAppConfig());
        ProjectView projectView = new ProjectView(httpServletRequest,
                "v6", pathParam, projectStaticData);
        logger.info("loadProjectViewV6 : Out");
        return projectView;
    }
    @Path("/{p0}/{p1}/{p2}/{p3}/{p4}/{p5}/{p6}/{p7}")
    @GET
    public ProjectView loadProjectViewV7(@PathParam("p0") String p0, @PathParam("p1") String p1,
                                         @PathParam("p2") String p2, @PathParam("p3") String p3,
                                         @PathParam("p4") String p4, @PathParam("p5") String p5,
                                         @PathParam("p6") String p6, @PathParam("p7") String p7) {
        logger.info("loadProjectViewV7 : In");
        ArrayList<String> pathParam = new ArrayList<String>();
        pathParam.add(p0);
        pathParam.add(p1);
        pathParam.add(p2);
        pathParam.add(p3);
        pathParam.add(p4);
        pathParam.add(p5);
        pathParam.add(p6);
        pathParam.add(p7);
        logger.info("Pathparameters : {}", pathParam);
        ProjectStaticData projectStaticData = todoConfiguration.getConfigInterface().getProjectStaticData(
                todoConfiguration.getConfigInterface().getAppConfig());
        ProjectView projectView = new ProjectView(httpServletRequest,
                "v7", pathParam, projectStaticData);
        logger.info("loadProjectViewV7 : Out");
        return projectView;
    }
    @Path("/{p0}/{p1}/{p2}/{p3}/{p4}/{p5}/{p6}/{p7}/{default: .*}")
    @GET
    public ProjectView loadProjectViewUnknown() {
        logger.info("loadProjectView : In");
        ProjectView projectView = new ProjectView(httpServletRequest,
                "unknown", null, null);
        logger.info("loadProjectView : Out");

        return projectView;
    }
}
