package com.project.ftl;

import com.project.ftl.view.FtlView;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

@Produces(MediaType.TEXT_HTML)
@Consumes(MediaType.APPLICATION_JSON)
@Path("/view")
public class FtlController {
    public FtlController() {}
    @GET
    public FtlView viewApplication(@Context HttpServletRequest request) {
        return new FtlView();
    }
}
