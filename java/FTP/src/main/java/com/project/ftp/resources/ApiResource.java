package com.project.ftp.resources;

import com.project.ftp.config.AppConfig;
import com.project.ftp.exceptions.AppException;
import com.project.ftp.obj.ApiResponse;
import com.project.ftp.service.FileService;
import com.project.ftp.service.FileServiceV2;
import com.project.ftp.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/api/")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ApiResource {
    final static Logger logger = LoggerFactory.getLogger(AppResource.class);
    private HttpServletRequest httpServletRequest;
    final AppConfig appConfig;
    final FileService fileService;
    final FileServiceV2 fileServiceV2;
    final UserService userService;
    public ApiResource(final AppConfig appConfig) {
        this.appConfig = appConfig;
        fileService = new FileService(appConfig);
        fileServiceV2 = new FileServiceV2(appConfig);
        userService = new UserService(appConfig);
    }
    @GET
    @Path("get_files_info")
    public ApiResponse getAllV3Data() throws AppException {
        logger.info("getAllV3Data : In");
        ApiResponse response = fileServiceV2.scanUserDirectory(userService);
        logger.info("getAllV3Data : Out: {}", response);
        return response;
    }
//    @GET
//    @Path("upload_files")
//
//    @GET
//    @Path("load_pdf")

//    @GET
//    @Path("is_login")

//    @GET
//    @Path("login_user")

//    @GET
//    @Path("change_password")
}
