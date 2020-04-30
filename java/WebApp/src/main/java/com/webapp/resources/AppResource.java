package com.webapp.resources;

import com.webapp.config.WebAppConfig;
import com.webapp.constants.AppConstant;
import com.webapp.constants.FileMimeType;
import com.webapp.obj.PathInfo;
import com.webapp.service.FileService;
import com.webapp.view.CommonView;
import com.webapp.view.IndexView;
import org.eclipse.jetty.server.Request;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;

@Path("/")
@Produces(MediaType.TEXT_HTML)
@Consumes(MediaType.APPLICATION_JSON)
public class AppResource {
    private static Logger logger = LoggerFactory.getLogger(AppResource.class);
    private HttpServletRequest httpServletRequest;
    private WebAppConfig webAppConfig;
    private FileService fileService;
    public AppResource(WebAppConfig webAppConfig) {
        this.webAppConfig = webAppConfig;
        fileService = new FileService(webAppConfig);
    }
    @GET
    public IndexView indexPage() {
        logger.info("Loading indexPage");
        /*
         * It will load resource path from app Config
         * */
        String reRoutePath = webAppConfig.getWebAppConfiguration().getIndexPageReRoute();
        return new IndexView(httpServletRequest, reRoutePath);
    }
    @GET
    @Path("index")
    public Response getIndex() throws URISyntaxException {
        logger.info("getIndex : redirect from /index to /");
        return Response.seeOther(new URI("/")).build();
    }
    @GET
    @Path("view/resource")
    public IndexView getViewResource() {
        logger.info("Loading indexPage");
        return new IndexView(httpServletRequest, null);
    }
    @Path("{default: .*}")
    @GET
    public Object defaultMethod(@Context HttpServletRequest request) throws URISyntaxException {
        logger.info("Loading defaultMethod: {}", ((Request) request).getUri().toString());
        String requestedPath = FileService.getPathUrl(request);
        PathInfo pathInfo = fileService.getFileResponse(requestedPath);
        Response.ResponseBuilder r;
        if (AppConstant.FILE.equals(pathInfo.getType())) {
            File file = new File(pathInfo.getPath());
            try {
                InputStream inputStream = new FileInputStream(file);
                r = Response.ok(inputStream);
                if (pathInfo.getMediaType() == null) {
                    logger.info("MediaType is not found (download now): {}", pathInfo);
                    String responseHeader = "attachment; filename=" + pathInfo.getFileName();
                    r.header(HttpHeaders.CONTENT_DISPOSITION, responseHeader);
                } else {
                    r.header(HttpHeaders.CONTENT_TYPE, pathInfo.getMediaType());
                }
                return r.build();
            } catch (Exception e) {
                logger.info("Error in loading file: {}", pathInfo);
            }
        }
        return new CommonView(request, "page_not_found_404.ftl");
    }
}
