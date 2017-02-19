package com.todo.resources;

import com.todo.TodoConfiguration;
import com.todo.config.TodoViewConfig;
import com.todo.domain.view.*;
import com.todo.services.ConfigService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.*;
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
    @Context
    private HttpServletRequest httpServletRequest;
    private TodoConfiguration todoConfiguration;
    public ViewResource(TodoConfiguration todoConfiguration, TodoViewConfig todoViewConfig) {
        this.todoConfiguration = todoConfiguration;
        this.todoViewConfig = todoViewConfig;
    }
    @GET
    public IndexView indexPage() {
        logger.info("Loading indexPage");
        ConfigService configService = new ConfigService(todoConfiguration);
        return new IndexView(httpServletRequest, configService.getResourceDetails());
    }
    @GET
    @Path("index")
    public Response getIndex() throws URISyntaxException {
        logger.info("getIndex : routing from /index to /");
        return Response.seeOther(new URI("/")).build();
    }
    @GET
    @Path("view/dashboard")
    public DashboardView getDashboard() {
        logger.info("getDashboard : In");
        DashboardView dashboardView = new DashboardView(httpServletRequest);
        logger.info("getDashboard : Out");
        return dashboardView;
    }
    @GET
    @Path("view/config")
    public ConfigView getConfigView() {
        logger.info("getConfigView : In");
        ConfigView configView = new ConfigView(httpServletRequest, todoConfiguration, "config.ftl");
        logger.info("getConfigView : Out");
        return configView;
    }
    @GET
    @Path("view/todo/")
    public Response gotoAllTodo() throws URISyntaxException {
        logger.info("getIndex : routing from /todo to /todo/all");
        return Response.seeOther(new URI("/todo/all")).build();
    }
    @GET
    @Path("view/todo/all")
    public TodoView loadAllTodoView() {
        logger.info("loadAllTodoView : In");
        TodoView todoView = new TodoView(httpServletRequest);
        logger.info("loadAllTodoView : Out");
        return todoView;
    }
    @GET
    @Path("view/todo/id")
    public Response gotoAllTodoFromUnknownId() throws URISyntaxException {
        logger.info("getIndex : routing from /todo/id to /todo/all");
        return Response.seeOther(new URI("/todo/all")).build();
    }
    @GET
    @Path("view/todo/id/{id}")
    public TodoView loadTodoView(@PathParam("id") String todoId) {
        logger.info("loadTodoView : In");
        TodoView todoView = new TodoView(httpServletRequest);
        logger.info("loadTodoView : Out");
        return todoView;
    }
    @Path("{default: .*}")
    @GET
    public CommonView defaultMethod() throws URISyntaxException {
        return new CommonView(httpServletRequest, "page_not_found_404.ftl");
    }
}
