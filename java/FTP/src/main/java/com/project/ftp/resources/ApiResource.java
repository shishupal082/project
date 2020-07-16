package com.project.ftp.resources;

import com.project.ftp.config.AppConfig;
import com.project.ftp.config.AppConstant;
import com.project.ftp.exceptions.AppException;
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
import java.util.ArrayList;

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
    public ArrayList<ScanResult> getAllV3Data() throws AppException {
        logger.info("getAllV3Data : In");
        ArrayList<ScanResult> scanResultAllDirecotry =
                fileServiceV2.scanAllDirectory(userService);
        logger.info("getAllV3Data : Out");
        return scanResultAllDirecotry;
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
