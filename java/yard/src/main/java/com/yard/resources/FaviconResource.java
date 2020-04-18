package com.yard.resources;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.net.URI;
import java.net.URISyntaxException;

/**
 * Created by shishupalkumar on 15/04/20.
 */
@Path("/favicon.ico")
public class FaviconResource {
    public FaviconResource(){}
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response LoadFaviconIcon() throws URISyntaxException {
        return Response.seeOther(new URI("/assets/favicon.ico")).build();
    }
}
