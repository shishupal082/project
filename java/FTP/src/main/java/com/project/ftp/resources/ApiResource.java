package com.project.ftp.resources;

import com.project.ftp.config.AppConfig;
import com.project.ftp.exceptions.AppException;
import com.project.ftp.exceptions.ErrorCodes;
import com.project.ftp.obj.ApiResponse;
import com.project.ftp.obj.LoginUserDetails;
import com.project.ftp.obj.RequestChangePassword;
import com.project.ftp.obj.RequestUserLogin;
import com.project.ftp.parser.JsonFileParser;
import com.project.ftp.service.FileServiceV2;
import com.project.ftp.service.UserService;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.InputStream;
import java.util.HashMap;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ApiResource {
    final static Logger logger = LoggerFactory.getLogger(ApiResponse.class);
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
    public Object defaultMethodApi(@Context HttpServletRequest request) {
        return fileServiceV2.handleDefaultUrl(request);
    }
    @GET
    @Path("/get_static_file")
    public ApiResponse getJsonData(@Context HttpServletRequest request) {
        logger.info("getJsonData : In");
        ApiResponse response;
        try {
            JsonFileParser jsonFileParser = new JsonFileParser(appConfig);
            response = new ApiResponse(jsonFileParser.getJsonObject());
        } catch (AppException ae) {
            logger.info("Error in reading app static file: {}", ae.getErrorCode().getErrorCode());
            response = new ApiResponse(ae.getErrorCode());
        }
        // Not putting response in log as it may be very large
        logger.info("getJsonData : Out");
        return response;
    }
    @GET
    @Path("/get_users")
    public ApiResponse getTextFileData(@Context HttpServletRequest request) {
        logger.info("getTextFileData : In");
        ApiResponse response;
        try {
            userService.isLoginUserAdmin(request);
            response = new ApiResponse(userService.getAllUser());
        } catch (AppException ae) {
            logger.info("Error in reading app static file: {}", ae.getErrorCode().getErrorCode());
            response = new ApiResponse(ae.getErrorCode());
        }
        logger.info("getTextFileData : Out");
        return response;
    }
    @GET
    @Path("/get_files_info")
    public ApiResponse getAllV3Data(@Context HttpServletRequest request) {
        logger.info("getAllV3Data : In");
        logger.info("loginUserDetails: {}", userService.getUserDataForLogging(request));
        ApiResponse response = fileServiceV2.scanUserDirectory(request, userService);
        // Not putting response in log as it may be very large
        logger.info("getAllV3Data : Out");
        return response;
    }
    @GET
    @Path("/get_app_config")
    public ApiResponse getAppConfig(@Context HttpServletRequest request) {
        logger.info("getAppConfig : In");
        logger.info("loginUserDetails: {}", userService.getUserDataForLogging(request));
        ApiResponse response;
        if (userService.isLoginUserDev(request)) {
            response = new ApiResponse(appConfig);
        } else {
            logger.info("Unauthorised username: {}, trying to access app config.",
                    userService.getLoginUserName(request));
            response = new ApiResponse(ErrorCodes.UNAUTHORIZED_USER);
        }
        logger.info("getAppConfig : Out: {}", response);
        return response;
    }
    @GET
    @Path("/get_session_config")
    public ApiResponse getSessionConfig(@Context HttpServletRequest request) throws AppException {
        logger.info("getSessionConfig : In");
        logger.info("loginUserDetails: {}", userService.getUserDataForLogging(request));
        ApiResponse response;
        if (userService.isLoginUserDev(request)) {
            response = new ApiResponse(appConfig.getSessionData());
        } else {
            logger.info("Unauthorised username: {}, trying to access session config.",
                    userService.getLoginUserName(request));
            response = new ApiResponse(ErrorCodes.UNAUTHORIZED_USER);
        }
        logger.info("getSessionConfig : Out: {}", response);
        return response;
    }
    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Path("/upload_file")
    public Response uploadFile(@Context HttpServletRequest request,
                                @FormDataParam("file") InputStream uploadedInputStream,
                               @FormDataParam("file") FormDataContentDisposition fileDetail) {
        logger.info("uploadFile: In, upload fileDetails: {}", fileDetail);
        logger.info("loginUserDetails: {}", userService.getUserDataForLogging(request));
        ApiResponse response;
        try {
            response = fileServiceV2.uploadFile(request, userService, uploadedInputStream, fileDetail.getFileName());
        } catch (AppException ae) {
            logger.info("Error in uploading file: {}", ae.getErrorCode().getErrorCode());
            response = new ApiResponse(ae.getErrorCode());
        }

        logger.info("uploadFile : Out");
        return Response.ok(response).build();
    }
    @POST
    @Path("/login_user")
    public ApiResponse loginUser(@Context HttpServletRequest httpServletRequest,
                                 RequestUserLogin userLogin) {
        logger.info("loginUser : In, {}", userLogin);
        HttpSession httpSession = httpServletRequest.getSession();
        ApiResponse response;
        try {
            HashMap<String, String> loginUserDetails = userService.loginUser(httpServletRequest, userLogin);
            response = new ApiResponse(loginUserDetails);
        } catch (AppException ae) {
            logger.info("Error in login user: {}", ae.getErrorCode().getErrorCode());
            response = new ApiResponse(ae.getErrorCode());
        }
        logger.info("loginUser : Out: {}", response);
        return response;
    }
    @GET
    @Path("/get_login_user_details")
    public ApiResponse getLoginUserDetails(@Context HttpServletRequest request) {
        logger.info("getLoginUserDetails : In");
        LoginUserDetails loginUserDetails = userService.getLoginUserDetails(request);
        ApiResponse response;
        if (loginUserDetails.getLogin()) {
            response = new ApiResponse(loginUserDetails);
        } else {
            response = new ApiResponse(ErrorCodes.UNAUTHORIZED_USER);
        }
        logger.info("getLoginUserDetails : Out, response: {}", response);
        return response;
    }
    @POST
    @Path("/change_password")
    public ApiResponse changePassword(@Context HttpServletRequest httpServletRequest,
                                 RequestChangePassword request) {
        logger.info("changePassword : In");
        ApiResponse response;
        try {
            userService.changePassword(httpServletRequest, request);
            response = new ApiResponse();
        } catch (AppException ae) {
            logger.info("Error in change password: {}", ae.getErrorCode().getErrorCode());
            response = new ApiResponse(ae.getErrorCode());
        }
        logger.info("changePassword : Out: {}", response);
        return response;
    }
    @Path("{default: .*}")
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Object defaultMethod(@Context HttpServletRequest request) {
        return fileServiceV2.handleDefaultUrl(request);
    }
}
