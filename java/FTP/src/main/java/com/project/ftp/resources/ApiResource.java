package com.project.ftp.resources;

import com.project.ftp.config.AppConfig;
import com.project.ftp.config.AppConstant;
import com.project.ftp.exceptions.AppException;
import com.project.ftp.obj.ApiResponse;
import com.project.ftp.service.FileServiceV2;
import com.project.ftp.service.UserService;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.InputStream;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ApiResource {
    final static Logger logger = LoggerFactory.getLogger(AppResource.class);
    private HttpServletRequest httpServletRequest;
    final AppConfig appConfig;
    final FileServiceV2 fileServiceV2;
    final UserService userService;
    public ApiResource(final AppConfig appConfig) {
        this.appConfig = appConfig;
        fileServiceV2 = new FileServiceV2(appConfig);
        userService = new UserService(appConfig);
    }
    @GET
    @Produces(MediaType.TEXT_HTML)
    @Consumes(MediaType.APPLICATION_JSON)
    public Object defaultMethodApi(@Context HttpServletRequest request) {
        return fileServiceV2.handleDefaultUrl(request);
    }
    @GET
    @Path("/get_files_info")
    public ApiResponse getAllV3Data() throws AppException {
        logger.info("getAllV3Data : In");
        ApiResponse response = fileServiceV2.scanUserDirectory(userService);
        logger.info("getAllV3Data : Out: {}", response);
        return response;
    }
    @GET
    @Path("/get_app_config")
    public ApiResponse getAppConfig() throws AppException {
        logger.info("getAppConfig : In");
        ApiResponse response = new ApiResponse(AppConstant.SUCCESS);
        response.setData(appConfig);
        logger.info("getAppConfig : Out: {}", response);
        return response;
    }
    @GET
    @Path("/get_session_config")
    public ApiResponse getSessionConfig() throws AppException {
        logger.info("getSessionConfig : In");
        ApiResponse response = new ApiResponse(AppConstant.SUCCESS);
        response.setData(appConfig.getSessionData());
        logger.info("getSessionConfig : Out: {}", response);
        return response;
    }    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/upload_file")
    public Response uploadFile(@FormDataParam("file") InputStream uploadedInputStream,
                               @FormDataParam("file") FormDataContentDisposition fileDetail) {
        logger.info("Requested upload fileDetails: {}", fileDetail);
        ApiResponse output = fileServiceV2.uploadFile(userService, uploadedInputStream, fileDetail.getFileName());
        return Response.ok(output).build();
    }
//    @GET
//    @Path("is_login")
//
//    @GET
//    @Path("login_user")
//
//    @GET
//    @Path("change_password")
    @Path("{default: .*}")
    @GET
    @Produces(MediaType.TEXT_HTML)
    @Consumes(MediaType.APPLICATION_JSON)
    public Object defaultMethod(@Context HttpServletRequest request) {
        return fileServiceV2.handleDefaultUrl(request);
    }
}
