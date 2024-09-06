package com.project.mvc.controller;


import com.project.mvc.service.RequestService;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.HashMap;

@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Path("")
public class ApiResource {
    private final String status = "status";
    private final String method = "method";
    private final String url = "url";
    private final String success = "SUCCESS";
    private final RequestService requestService;
    public ApiResource(RequestService requestService) {
        this.requestService = requestService;
    }
    @GET
    public Response applicationHome(@Context HttpServletRequest request) {
        HashMap<String, String> result = new HashMap<>();
        result.put(this.status, this.success);
        result.put(this.method, "applicationHome");
        result.put(this.url, requestService.getPathUrl(request));
        return Response.ok(result).build();
    }
    @GET
    @Path("/api")
    public Response apiMethod(@Context HttpServletRequest request) {
        HashMap<String, String> result = new HashMap<>();
        result.put(this.status, this.success);
        result.put(this.method, "apiMethod");
        result.put(this.url, requestService.getPathUrl(request));
        return Response.ok(result).build();
    }
    @GET
    @Path("{default: .*}")
    public Response defaultMethod(@Context HttpServletRequest request) {
        HashMap<String, String> result = new HashMap<>();
        result.put(this.status, this.success);
        result.put(this.method, "defaultMethod");
        result.put(this.url, requestService.getPathUrl(request));
        return Response.ok(result).build();
    }
}
