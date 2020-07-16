package com.project.ftp.resources;

import com.project.ftp.config.AppConfig;
import com.project.ftp.config.AppConstant;
import com.project.ftp.config.PathType;
import com.project.ftp.obj.PathInfo;
import com.project.ftp.obj.ScanResult;
import com.project.ftp.service.FileService;
import com.project.ftp.service.FileServiceV2;
import com.project.ftp.service.UserService;
import com.project.ftp.view.CommonView;
import com.project.ftp.view.IndexView;
import org.eclipse.jetty.server.Request;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
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
    final AppConfig appConfig;
    final FileService fileService;
    final FileServiceV2 fileServiceV2;
    final UserService userService;
    public AppResource(final AppConfig appConfig) {
        this.appConfig = appConfig;
        fileService = new FileService(appConfig);
        fileServiceV2 = new FileServiceV2(appConfig);
        userService = new UserService(appConfig);
    }
    @GET
    public IndexView indexPage() {
        logger.info("Loading indexPage");
        /*
         * It will load resource path from app Config
         * */
        String reRoutePath = appConfig.getFtpConfiguration().getIndexPageReRoute();
        return new IndexView(httpServletRequest, reRoutePath);
    }
    @GET
    @Path("index")
    public Response getIndex() throws URISyntaxException {
        logger.info("getIndex : redirect from /index to /");
        return Response.seeOther(new URI("/")).build();
    }
    @GET
    @Path("/view/resource")
    public IndexView getViewResource() {
        logger.info("Loading indexPage");
        return new IndexView(httpServletRequest, null);
    }
    @GET
    @Path("/view/file")
    public Object viewFile(@Context HttpServletRequest request, @QueryParam("name") String filename) {
        logger.info("Loading viewFile: {}", filename);
        ScanResult scanResult = fileServiceV2.searchRequestedFile(userService, filename);
        PathInfo pathInfo = null;
        if (scanResult != null && PathType.FILE.equals(scanResult.getPathType())) {
            pathInfo = fileService.getFileResponse(scanResult.getPathName());
        }
        Response.ResponseBuilder r;
        if (pathInfo != null) {
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
