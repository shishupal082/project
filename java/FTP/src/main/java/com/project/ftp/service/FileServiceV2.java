package com.project.ftp.service;

import com.project.ftp.common.SysUtils;
import com.project.ftp.config.AppConfig;
import com.project.ftp.config.AppConstant;
import com.project.ftp.config.PathType;
import com.project.ftp.exceptions.AppException;
import com.project.ftp.exceptions.ErrorCodes;
import com.project.ftp.obj.ApiResponse;
import com.project.ftp.obj.LoginUserDetails;
import com.project.ftp.obj.PathInfo;
import com.project.ftp.obj.ScanResult;
import com.project.ftp.view.CommonView;
import org.eclipse.jetty.server.Request;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;

public class FileServiceV2 {
    final static Logger logger = LoggerFactory.getLogger(FileServiceV2.class);
    final AppConfig appConfig;
    final FileService fileService;
    public FileServiceV2(final AppConfig appConfig) {
        this.appConfig = appConfig;
        this.fileService = new FileService();
    }
    private String parseUserFileName(String fileName) {
        String userFilename = null;
        if (fileName == null) {
            return null;
        }
        String dir = appConfig.getFtpConfiguration().getFileSaveDir();
        String[] fileNameArr = fileName.split(dir);
        if(fileNameArr.length == 2) {
            if (fileNameArr[1].split("/").length == 2) {
                userFilename = fileNameArr[1];
            }
        }
        return userFilename;
    }
    private void generateApiResponse(ArrayList<ScanResult> scanResults, ArrayList<String> response) {
        if (scanResults == null) {
            return;
        }
        String fileName;
        String[] fileNameArr;

        for (ScanResult scanResult: scanResults) {
            if (scanResult != null) {
                if (PathType.FILE.equals(scanResult.getPathType())) {
                    fileName = parseUserFileName(scanResult.getPathName());
                    if (fileName != null) {
                        response.add(fileName);
                    }
                } else if (PathType.FOLDER.equals(scanResult.getPathType())) {
                    generateApiResponse(scanResult.getScanResults(), response);
                }
            }
        }
    }
    public ApiResponse scanUserDirectory(HttpServletRequest request, final UserService userService2) {
        ApiResponse apiResponse;
        LoginUserDetails loginUserDetails = userService2.getLoginUserDetails(request);
        ArrayList<ScanResult> scanResults = new ArrayList<>();
        String dir = appConfig.getFtpConfiguration().getFileSaveDir();
        String publicDir = dir+AppConstant.PUBLIC+"/";
        String loginUserName = loginUserDetails.getUsername();
        if (loginUserDetails.getLogin()) {
            if (loginUserDetails.getLoginUserAdmin()) {
                scanResults.add(fileService.scanDirectory(dir, dir, true));
            } else {
                dir = dir + loginUserName + "/";
                scanResults.add(fileService.scanDirectory(dir, dir, false));
            }
            scanResults.add(fileService.scanDirectory(publicDir, publicDir, false));
            ArrayList<String> response = new ArrayList<>();
            generateApiResponse(scanResults, response);
            logger.info("scanUserDirectory result size: {}", response.size());
            apiResponse = new ApiResponse(response);
        } else {
            apiResponse = new ApiResponse(ErrorCodes.UNAUTHORIZED_USER);
        }
        return apiResponse;
    }
    public PathInfo searchRequestedFile(HttpServletRequest request, final UserService userService,
                                        String filename) throws AppException {
        if (filename == null) {
            logger.info("filename can not be null");
            throw new AppException(ErrorCodes.INVALID_QUERY_PARAMS);
        }
        LoginUserDetails loginUserDetails = userService.getLoginUserDetails(request);
        String loginUserName = loginUserDetails.getUsername();
        String[] filenameArr = filename.split("/");
        String filePath = appConfig.getFtpConfiguration().getFileSaveDir();
        PathInfo pathInfo = null;
        if (filenameArr.length == 2) {
            if (loginUserName.isEmpty()) {
                logger.info("Invalid loginUserName: {}", loginUserName);
                throw new AppException(ErrorCodes.UNAUTHORIZED_USER);
            }
            if (loginUserDetails.getLoginUserAdmin() || AppConstant.PUBLIC.equals(filenameArr[0])) {
                filePath += filename;
            } else if (loginUserName.equals(filenameArr[0])) {
                filePath += loginUserName + "/" + filenameArr[1];
            } else {
                logger.info("Unauthorised access loginUserName: {}, filename: {}",
                        loginUserName, filename);
                throw new AppException(ErrorCodes.UNAUTHORIZED_USER);
            }
            pathInfo = fileService.getPathInfo(filePath);
            logger.info("Search result: {}", pathInfo);
            if (!AppConstant.FILE.equals(pathInfo.getType())) {
                throw new AppException(ErrorCodes.FILE_NOT_FOUND);
            }
        } else {
            logger.info("Invalid filename:{}", filename);
            throw new AppException(ErrorCodes.INVALID_QUERY_PARAMS);
        }
        return pathInfo;
    }
    public Object handleDefaultUrl(@Context HttpServletRequest request) {
        logger.info("Loading defaultMethod: {}", ((Request) request).getUri().toString());
        String requestedPath = StaticService.getPathUrl(request);
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
    public ApiResponse doUpload(InputStream uploadedInputStream, String fileName) throws AppException {
        PathInfo pathInfo = fileService.getPathInfo(fileName);
        if (AppConstant.FILE.equals(pathInfo.getType())) {
            logger.info("Filename: {}, already exist, re-naming it. {}", fileName, pathInfo);
            String ext = pathInfo.getExtension();
            String parentFolder = pathInfo.getParentFolder() + "/";;
            fileService.renameExistingFile(parentFolder, pathInfo.getFilenameWithoutExt(), ext);
        }
        Integer maxFileSize = appConfig.getFtpConfiguration().getMaxFileSize();
        ApiResponse apiResponse;
        pathInfo = fileService.uploadFile(uploadedInputStream, fileName, maxFileSize);
        if (!AppConstant.FILE.equals(pathInfo.getType())) {
            logger.info("Error in uploading file pathInfo: {}", pathInfo);
            throw new AppException(ErrorCodes.INVALID_USER_NAME);
        } else {
            logger.info("uploaded file pathInfo: {}", pathInfo);
            String filePath = parseUserFileName(pathInfo.getPath());
            if (filePath == null) {
                logger.info("File uploaded in wrong directory: {}", pathInfo);
                throw new AppException(ErrorCodes.FILE_NOT_FOUND);
            }
            pathInfo.setPath(filePath);
            pathInfo.setParentFolder(null);
            apiResponse = new ApiResponse(pathInfo);
        }
        return apiResponse;
    }
    public ApiResponse uploadFile(HttpServletRequest request, UserService userService,
                                  InputStream uploadedInputStream, String fileName) throws AppException {
        LoginUserDetails loginUserDetails = userService.getLoginUserDetails(request);
        if (!loginUserDetails.getLogin()) {
            logger.info("UnAuthorised user trying to upload file: {}", fileName);
            throw new AppException(ErrorCodes.UNAUTHORIZED_USER);
        }
        String loginUserName = loginUserDetails.getUsername();
        PathInfo pathInfo = fileService.getPathInfoFromFileName(fileName);
        logger.info("PathInfo generated from request filename: {}, {}", fileName, pathInfo);
        String ext = pathInfo.getExtension();
        ArrayList<String> supportedFileType = appConfig.getFtpConfiguration().getSupportedFileType();
        if (supportedFileType == null) {
            logger.info("Config error, supportedFileType is Null.");
            throw new AppException(ErrorCodes.CONFIG_ERROR);
        }
        if (!supportedFileType.contains(ext)) {
            logger.info("File extension '{}', is not supported", ext);
            throw new AppException(ErrorCodes.UNSUPPORTED_FILE_TYPE);
        }
        SysUtils sysUtils = new SysUtils();
        String dir = appConfig.getFtpConfiguration().getFileSaveDir();
        String uploadingFileName = dir + loginUserName + "/" + sysUtils.getDateTime(AppConstant.FileFormate) +
                "." + pathInfo.getExtension();
        if (parseUserFileName(uploadingFileName) == null) {
            logger.info("Invalid upload filepath: {}", uploadingFileName);
            throw new AppException(ErrorCodes.INVALID_FILE_SAVE_PATH);
        }
        boolean dirStatus = true;
        if (!fileService.isDirectory(dir+loginUserName)) {
            dirStatus = fileService.createFolder(dir, loginUserName);
        }
        ApiResponse apiResponse;
        if (dirStatus) {
            apiResponse = doUpload(uploadedInputStream, uploadingFileName);
        } else {
            logger.info("Error in creating directory for username: {}", loginUserName);
            throw new AppException(ErrorCodes.INVALID_FILE_SAVE_PATH);
        }
        return apiResponse;
    }
}
