package com.todo.resources;

import com.todo.TodoConfiguration;
import com.todo.config.TodoViewConfig;
import com.todo.domain.view.DashboardView;
import com.todo.domain.view.IndexView;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.net.URI;
import java.net.URISyntaxException;

/**
 * Created by shishupalkumar on 04/02/17.
 */

@Path("/")
@Produces(MediaType.TEXT_HTML)
@Consumes(MediaType.APPLICATION_JSON)
public class ViewResource {
    private static Logger logger = LoggerFactory.getLogger(TodoResource.class);
    private TodoViewConfig todoViewConfig;
    public ViewResource(TodoConfiguration todoConfiguration, TodoViewConfig todoViewConfig) {
        this.todoViewConfig = todoViewConfig;
    }
    @GET
    public IndexView indexPage(@Context final HttpServletRequest httpServletRequest) {
        logger.info("indexPage : In");
        IndexView indexView = new IndexView(httpServletRequest);
        logger.info("indexPage : Out");
        return indexView;
    }
    @GET
    @Path("/index")
    public Response getIndex() throws URISyntaxException {
        logger.info("getIndex : routing from /index to /");
        return Response.seeOther(new URI("/")).build();
    }
    @GET
    @Path("/dashboard")
    public DashboardView getDashboard(@Context final HttpServletRequest httpServletRequest) {
        logger.info("getDashboard : In");
        DashboardView dashboardView = new DashboardView(httpServletRequest);
        logger.info("getDashboard : Out");
        return dashboardView;
    }
}
