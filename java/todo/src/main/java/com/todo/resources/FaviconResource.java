package com.todo.resources;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.net.URI;
import java.net.URISyntaxException;

/**
 * Created by shishupalkumar on 16/04/17.
 */
@Path("/favicon.ico")
public class FaviconResource {
    private static Logger logger = LoggerFactory.getLogger(FilesResource.class);
    public FaviconResource(){}
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response LoadFaviconIcon() throws URISyntaxException {
        return Response.seeOther(new URI("/assets/favicon.ico")).build();
//        String fileData = null;
//        try {
//            Response.ResponseBuilder r = Response.ok(
//                new File("assets/favicon.ico"), "image/x-icon");
//            return r.build();
//        } catch (Exception e) {
//            fileData = "Error loading favicon icon";
//            logger.info("{} : {}", fileData, e);
//        }
//        return Response.ok(fileData).build();
    }
}
