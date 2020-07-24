package com.project.ftp.resources;

import com.project.ftp.config.AppConfig;
import com.project.ftp.exceptions.AppException;
import com.project.ftp.obj.PathInfo;
import com.project.ftp.service.FileServiceV2;
import com.project.ftp.service.UserService;
import com.project.ftp.view.AppView;
import com.project.ftp.view.CommonView;
import com.project.ftp.view.IndexView;
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
    final static Logger logger = LoggerFactory.getLogger(AppResource.class);
    private HttpServletRequest httpServletRequest;
    final AppConfig appConfig;
    final FileServiceV2 fileServiceV2;
    final UserService userService;
    final String appViewFtlFileName;
    public AppResource(final AppConfig appConfig) {
        this.appConfig = appConfig;
        fileServiceV2 = new FileServiceV2(appConfig);
        userService = new UserService(appConfig);
        appViewFtlFileName = appConfig.getFtpConfiguration().getAppViewFtlFileName();
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
    @Path("/index")
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
        PathInfo pathInfo = null;
        Response.ResponseBuilder r;
        try {
            pathInfo = fileServiceV2.searchRequestedFile(request, userService, filename);
        } catch (AppException ae) {
            logger.info("Error in searching requested file: {}", ae.getErrorCode().getErrorCode());
        }
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
    @GET
    @Path("/download/file")
    public Object downloadFile(@Context HttpServletRequest request, @QueryParam("name") String filename) {
        logger.info("Loading viewFile: {}", filename);
        PathInfo pathInfo = null;
        Response.ResponseBuilder r;
        try {
            pathInfo = fileServiceV2.searchRequestedFile(request, userService, filename);
        } catch (AppException ae) {
            logger.info("Error in searching requested file: {}", ae.getErrorCode().getErrorCode());
        }
        if (pathInfo != null) {
            File file = new File(pathInfo.getPath());
            try {
                InputStream inputStream = new FileInputStream(file);
                r = Response.ok(inputStream);
                String responseHeader = "attachment; filename=" + pathInfo.getFileName();
                r.header(HttpHeaders.CONTENT_DISPOSITION, responseHeader);
                return r.build();
            } catch (Exception e) {
                logger.info("Error in loading file: {}", pathInfo);
            }
        }
        return new CommonView(request, "page_not_found_404.ftl");
    }
    @GET
    @Path("/dashboard")
    public AppView dashboard(@Context HttpServletRequest request) {
        return new AppView(request, appViewFtlFileName,"dashboard", userService);
    }
    @GET
    @Path("/login")
    public AppView login(@Context HttpServletRequest request) {
        return new AppView(request, appViewFtlFileName, "login", userService);
    }
    @GET
    @Path("/logout")
    public AppView logout(@Context HttpServletRequest request) {
        userService.logoutUser(request);
        return new AppView(request, appViewFtlFileName, "logout", userService);
    }
    @GET
    @Path("/register")
    public AppView register(@Context HttpServletRequest request) {
        return new AppView(request, appViewFtlFileName, "register", userService);
    }
    @GET
    @Path("/upload_file")
    public AppView uploadFile(@Context HttpServletRequest request) {
        return new AppView(request, appViewFtlFileName, "upload_file", userService);
    }
    @GET
    @Path("/change_password")
    public AppView changePassword(@Context HttpServletRequest request) {
        return new AppView(request, appViewFtlFileName, "change_password", userService);
    }
    @GET
    @Path("/forgot_password")
    public AppView forgotPassword(@Context HttpServletRequest request) {
        return new AppView(request, appViewFtlFileName, "forgot_password", userService);
    }
    @Path("{default: .*}")
    @GET
    @Produces(MediaType.TEXT_HTML)
    @Consumes(MediaType.APPLICATION_JSON)
    public Object defaultMethod(@Context HttpServletRequest request) {
        return fileServiceV2.handleDefaultUrl(request);
    }
}
