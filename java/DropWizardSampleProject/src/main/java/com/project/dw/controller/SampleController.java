package com.project.dw.controller;


import com.project.dw.SampleConfiguration;
import com.project.dw.view.SampleView;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SampleController {
    final static Logger logger = LoggerFactory.getLogger(SampleController.class);
    private final SampleConfiguration configuration;
    public SampleController(SampleConfiguration configuration) {
        this.configuration = configuration;
    }
    @GET
    @Path("/app/view")
    @Produces(MediaType.TEXT_HTML)
    public Response appView(@Context HttpServletRequest request) {
        logger.info("Loading /app/view");
        return Response.ok(new SampleView("app_view.ftl", configuration)).build();
    }
    @GET
    @Path("{default: .*}")
    @Produces(MediaType.TEXT_HTML)
    public Response defaultMethod(@Context HttpServletRequest request) {
        logger.info("Loading default url");
        return Response.ok(new SampleView("file_not_found.ftl", configuration)).build();
    }
}
