package com.todo.resources;

import com.todo.TodoConfiguration;
import com.todo.file.config.FilesConfig;
import com.todo.file.domain.FileDetails;
import com.todo.file.service.FilesService;
import com.todo.utils.ErrorCodes;
import com.todo.utils.TodoException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * Created by shishupalkumar on 16/04/17.
 */
@Path("/favicon.ico")
public class FaviconResource {
    private static Logger logger = LoggerFactory.getLogger(FilesResource.class);
    private FilesService filesService;
    @Context
    private HttpServletRequest httpServletRequest;
    public FaviconResource(TodoConfiguration todoConfiguration, String directoryConfigPath) {
        FilesConfig filesConfig = FilesService.getFileConfig(directoryConfigPath);
        this.filesService = new FilesService(filesConfig);
    }
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response LoadFaviconIcon() throws TodoException {

        String fileData = null;
        FileDetails fileDetails = filesService.getStaticFileDetails("assets/favicon.ico");
        Response.ResponseBuilder r;
        try {
            r = Response.ok(fileDetails.getFile(), fileDetails.getFileMemType());
            httpServletRequest.setAttribute("Status Code", 304);
            return r.build();
        } catch (TodoException todoe) {
            fileData = todoe.getMessage();
            logger.info("Error parsing file : {}", fileData);
        } catch (Exception e) {
            fileData = "Invalid arguments";
            logger.info("Error parsing file : {} : {}", fileData, e);
        }
        return Response.ok(fileData).build();
    }
}
