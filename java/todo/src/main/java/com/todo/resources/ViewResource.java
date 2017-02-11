package com.todo.resources;

import com.todo.TodoConfiguration;
import com.todo.config.TodoViewConfig;
import com.todo.domain.view.CommonView;
import com.todo.domain.view.DashboardView;
import com.todo.domain.view.TodoView;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
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
    public ViewResource(TodoConfiguration todoConfiguration, TodoViewConfig todoViewConfig) {
        this.todoViewConfig = todoViewConfig;
    }
    @GET
    public CommonView indexPage(@Context final HttpServletRequest httpServletRequest) {
        logger.info("Loading indexPage");
        return new CommonView(httpServletRequest, "index.ftl");
    }
    @GET
    @Path("index")
    public Response getIndex() throws URISyntaxException {
        logger.info("getIndex : routing from /index to /");
        return Response.seeOther(new URI("/")).build();
    }
    @GET
    @Path("dashboard")
    public DashboardView getDashboard(@Context final HttpServletRequest httpServletRequest) {
        logger.info("getDashboard : In");
        DashboardView dashboardView = new DashboardView(httpServletRequest);
        logger.info("getDashboard : Out");
        return dashboardView;
    }
    @GET
    @Path("todo/")
    public Response gotoAllTodo() throws URISyntaxException {
        logger.info("getIndex : routing from /todo to /todo/all");
        return Response.seeOther(new URI("/todo/all")).build();
    }
    @GET
    @Path("todo/all")
    public TodoView loadAllTodoView(@Context final HttpServletRequest httpServletRequest) {
        logger.info("loadAllTodoView : In");
        TodoView todoView = new TodoView(httpServletRequest);
        logger.info("loadAllTodoView : Out");
        return todoView;
    }
    @GET
    @Path("todo/id")
    public Response gotoAllTodoFromUnknownId() throws URISyntaxException {
        logger.info("getIndex : routing from /todo/id to /todo/all");
        return Response.seeOther(new URI("/todo/all")).build();
    }
    @GET
    @Path("todo/id/{id}")
    public TodoView loadTodoView(@Context final HttpServletRequest httpServletRequest,
                                 @PathParam("id") String todoId) {
        logger.info("loadTodoView : In");
        TodoView todoView = new TodoView(httpServletRequest);
        logger.info("loadTodoView : Out");
        return todoView;
    }
    @Path("/{default: .*}")
    @GET
    public CommonView defaultMethod(@Context final HttpServletRequest httpServletRequest) throws URISyntaxException {
        return new CommonView(httpServletRequest, "page_not_found_404.ftl");
    }
}
