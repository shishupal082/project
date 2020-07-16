package com.project.ftp.service;

import com.project.ftp.common.SysUtils;
import com.project.ftp.config.AppConfig;
import com.project.ftp.config.AppConstant;
import com.project.ftp.config.PathType;
import com.project.ftp.exceptions.ErrorCodes;
import com.project.ftp.obj.ApiResponse;
import com.project.ftp.obj.PathInfo;
import com.project.ftp.obj.ScanResult;
import com.project.ftp.view.CommonView;
import org.eclipse.jetty.server.Request;
import org.glassfish.jersey.server.ContainerRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;

public class FileServiceV2 {
    final static Logger logger = LoggerFactory.getLogger(FileServiceV2.class);
    final AppConfig appConfig;
    final FileService fileService;
    public FileServiceV2(final AppConfig appConfig) {
        this.appConfig = appConfig;
        this.fileService = new FileService();
    }
    private void generateApiResponse(ArrayList<ScanResult> scanResults, ArrayList<String> response) {
        if (scanResults == null) {
            return;
        }
        String fileName;
        String[] fileNameArr;
        String dir = appConfig.getFtpConfiguration().getFileSaveDir();
        for (ScanResult scanResult: scanResults) {
            if (scanResult != null) {
                if (PathType.FILE.equals(scanResult.getPathType())) {
                    fileName = scanResult.getPathName();
                    fileNameArr = fileName.split(dir);
                    if(fileNameArr.length == 2) {
                        if (fileNameArr[1].split("/").length == 2) {
                            response.add(fileNameArr[1]);
                        }
                    }
                } else if (PathType.FOLDER.equals(scanResult.getPathType())) {
                    generateApiResponse(scanResult.getScanResults(), response);
                }
            }
        }
    }
    public ApiResponse scanUserDirectory(final UserService userService) {
        ApiResponse apiResponse = new ApiResponse(AppConstant.SUCCESS);
        ArrayList<ScanResult> scanResults = new ArrayList<>();
        String dir = appConfig.getFtpConfiguration().getFileSaveDir();
        String loginUserName = userService.getLoginUserName();
        if (userService.isLogin() && !loginUserName.isEmpty()) {
            if (userService.isLoginUserAdmin()) {
                scanResults.add(fileService.scanDirectory(dir, dir, true));
            } else {
                dir += loginUserName + "/";
                scanResults.add(fileService.scanDirectory(dir, dir, false));
            }
            ArrayList<String> response = new ArrayList<>();
            generateApiResponse(scanResults, response);
            apiResponse.setData(response);
        } else {
            apiResponse = new ApiResponse(ErrorCodes.UNAUTHORIZED_USER);
        }
        return apiResponse;
    }
    public ScanResult searchRequestedFile(final UserService userService, String filename) {
        if (filename == null) {
            filename = "";
        }
        String dir = appConfig.getFtpConfiguration().getFileSaveDir();
        String loginUserName = userService.getLoginUserName();
        String[] filenameArr = filename.split("/");
        String filePath = dir;
        ScanResult scanResult = null;
        if (filenameArr.length == 2) {
            if (loginUserName.isEmpty()) {
                logger.info("Invalid loginUserName: {}", loginUserName);
                return null;
            }
            if (userService.isLoginUserAdmin()) {
                filePath += filename;
            } else if (loginUserName.equals(filenameArr[0])) {
                filePath += loginUserName + "/" + filenameArr[1];
            } else {
                logger.info("Unauthorised access loginUserName: {}, filename: {}",
                        loginUserName, filename);
                filePath = null;
            }
            if (filePath != null) {
                scanResult = fileService.scanDirectory(filePath, filePath, false);
                logger.info("Scan result: {}", scanResult);
            }
        } else {
            logger.info("Invalid filename:{}", filename);
        }
        return scanResult;
    }
    public Object handleDefaultUrl(@Context HttpServletRequest request) {
        logger.info("Loading defaultMethod: {}", ((Request) request).getUri().toString());
        String requestedPath = getPathUrl(request);
        PathInfo pathInfo = getFileResponse(requestedPath, false);
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
    public PathInfo getFileResponse(String filePath, Boolean isAbsolute) {
        if (!isAbsolute) {
            filePath = appConfig.getPublicDir() + filePath;
        }
        PathInfo pathInfo = fileService.getPathInfo(filePath);
        if (AppConstant.FOLDER.equals(pathInfo.getType())) {
            pathInfo = fileService.searchIndexHtmlInFolder(pathInfo);
        }
        logger.info("PathDetails: {}", pathInfo.toString());
        return pathInfo;
    }
    public ApiResponse doUpload(InputStream uploadedInputStream, String fileName) {
        PathInfo pathInfo = fileService.getPathInfo(fileName);
        if (AppConstant.FILE.equals(pathInfo.getType())) {
            logger.info("Filename: {}, already exist, re-naming it. {}", fileName, pathInfo);
            String ext = pathInfo.getExtension();
            String parentFolder = pathInfo.getParentFolder() + "/";;
            fileService.renameExistingFile(parentFolder, pathInfo.getFilenameWithoutExt(), ext);
        }
        pathInfo = fileService.uploadFile(uploadedInputStream, fileName);
        ApiResponse apiResponse;
        if (!AppConstant.FILE.equals(pathInfo.getType())) {
            logger.info("Error in uploading file pathInfo: {}", pathInfo);
            apiResponse = new ApiResponse(ErrorCodes.INVALID_USER_NAME);
        } else {
            logger.info("uploaded file pathInfo: {}", pathInfo);
            apiResponse = new ApiResponse(AppConstant.SUCCESS);
            apiResponse.setData(pathInfo);
        }
        return apiResponse;
    }
    public ApiResponse uploadFile(UserService userService,
                                  InputStream uploadedInputStream, String fileName) {
        ApiResponse apiResponse = new ApiResponse(ErrorCodes.UNAUTHORIZED_USER);
        String loginUserName = userService.getLoginUserName();
        if (!userService.isLogin() || loginUserName.isEmpty()) {
            logger.info("UnAuthorised user trying to upload file: {}", fileName);
            return apiResponse;
        }
        PathInfo pathInfo = fileService.getPathInfoFromFileName(fileName);
        logger.info("PathInfo generated from request filename: {}, {}", fileName, pathInfo);
        String ext = pathInfo.getExtension();
        ArrayList<String> supportedFileType = appConfig.getFtpConfiguration().getSupportedFileType();
        if (supportedFileType == null) {
            logger.info("Config error, supportedFileType is Null.");
            apiResponse = new ApiResponse(ErrorCodes.CONFIG_ERROR);
            return apiResponse;
        }
        if (!supportedFileType.contains(ext)) {
            logger.info("File extension '{}', is not supported", ext);
            apiResponse = new ApiResponse(ErrorCodes.UNSUPPORTED_FILE_TYPE);
            return apiResponse;
        }
        SysUtils sysUtils = new SysUtils();
        String timeInMs = sysUtils.getDateTime(AppConstant.FileFormate) +
                "." + pathInfo.getExtension();
        String dir = appConfig.getFtpConfiguration().getFileSaveDir();
        PathInfo pathInfo1 = fileService.getPathInfo(dir + "/" + loginUserName);
        boolean dirStatus = true;
        if (!AppConstant.FOLDER.equals(pathInfo1.getType())) {
            dirStatus = fileService.createFolder(dir, loginUserName);
        }
        if (dirStatus) {
            fileName = loginUserName + "/" + timeInMs;
            apiResponse = doUpload(uploadedInputStream, dir + fileName);
        } else {
            logger.info("Error in creating directory for username: {}", loginUserName);
            apiResponse = new ApiResponse(ErrorCodes.INVALID_USER_NAME);
        }
        return apiResponse;
    }
    public static String getPathUrl(final HttpServletRequest request) {
        String path = ((Request) request).getUri().toString();
        String[] pathArr = path.split("\\?");
        if (pathArr.length > 0) {
            path = pathArr[0];
        }
        return path;
    }
    public static String getPathUrlV2(final ContainerRequestContext requestContext) {
        String path = ((ContainerRequest) requestContext).getPath(true);
        String[] pathArr = path.split("\\?");
        if (pathArr.length > 0) {
            path = pathArr[0];
        }
        return path;
    }
}
