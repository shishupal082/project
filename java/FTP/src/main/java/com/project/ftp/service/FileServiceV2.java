package com.project.ftp.service;

import com.project.ftp.config.AppConfig;
import com.project.ftp.config.AppConstant;
import com.project.ftp.config.PathType;
import com.project.ftp.exceptions.AppException;
import com.project.ftp.exceptions.ErrorCodes;
import com.project.ftp.obj.*;
import com.project.ftp.view.CommonView;
import org.eclipse.jetty.server.Request;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
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
                if (!AppConstant.PUBLIC.equals(loginUserName.toLowerCase())) {
                    scanResults.add(fileService.scanDirectory(publicDir, publicDir, false));
                }
            }
            ArrayList<String> response = new ArrayList<>();
            generateApiResponse(scanResults, response);
            logger.info("scanUserDirectory result size: {}", response.size());
            apiResponse = new ApiResponse(response);
        } else {
            apiResponse = new ApiResponse(ErrorCodes.UNAUTHORIZED_USER);
        }
        return apiResponse;
    }
    private HashMap<String, String> parseRequestedFileStr(String filename) {
        HashMap<String, String> response = new HashMap<>();
        response.put(AppConstant.STATUS, AppConstant.FAILURE);
        if (filename == null) {
            logger.info("filename can not be null");
            return response;
        }
        String[] filenameArr = filename.split("/");
        if (filenameArr.length == 2) {
            if (filenameArr[0].isEmpty()) {
                logger.info("filename does not contain username: {}", filename);
                return response;
            }
            if (filenameArr[1].isEmpty()) {
                logger.info("filename is empty in request: {}", filename);
                return response;
            }
            response.put(AppConstant.STATUS, AppConstant.SUCCESS);
            response.put("fileUserName", filenameArr[0]);
            response.put("fileNameStr", filenameArr[1]);
        }
        return response;
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
    public void deleteRequestFile(HttpServletRequest request,
                                         UserService userService,
                                         RequestDeleteFile deleteFile) throws AppException {
        LoginUserDetails loginUserDetails = userService.getLoginUserDetails(request);
        if (!loginUserDetails.getLogin()) {
            logger.info("Login required to deleteFile: {}", deleteFile);
            throw new AppException(ErrorCodes.UNAUTHORIZED_USER);
        }
        if (deleteFile == null) {
            logger.info("deleteFile request is null.");
            throw new AppException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        String deleteFileReq = deleteFile.getFilename();
        HashMap<String, String> parsedFileStr = this.parseRequestedFileStr(deleteFileReq);
        if (AppConstant.FAILURE.equals(parsedFileStr.get(AppConstant.STATUS))) {
            throw new AppException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        String fileUserName = parsedFileStr.get("fileUserName");
        String userName = loginUserDetails.getUsername();
        if (!fileUserName.equals(userName)) {
            logger.info("UnAuthorised user trying to deleteFile: {}", loginUserDetails);
            throw new AppException(ErrorCodes.UNAUTHORIZED_USER);
        }
        String dir = appConfig.getFtpConfiguration().getFileSaveDir();
        PathInfo pathInfo = fileService.getPathInfo(dir + deleteFileReq);
        Boolean permanentlyDeleteFile = appConfig.getFtpConfiguration().getPermanentlyDeleteFile();
        Boolean fileDeleteStatus = false;
        if (AppConstant.FILE.equals(pathInfo.getType())) {
            if (permanentlyDeleteFile == null || permanentlyDeleteFile) {
                logger.info("Permanently deleting file: {}", deleteFile);
                fileDeleteStatus = fileService.deleteFileV2(dir+deleteFileReq);
            } else {
                ArrayList<String> requiredDirs = new ArrayList<>();
                requiredDirs.add(dir);
                requiredDirs.add("trash");
                requiredDirs.add(userName);
                String trashFolder = fileService.createDir(requiredDirs);
                if (trashFolder == null) {
                    logger.info("Error in creating trash folder for user: {}", loginUserDetails);
                    throw new AppException(ErrorCodes.RUNTIME_ERROR);
                }
                String currentFolder = pathInfo.getParentFolder();
                fileDeleteStatus = fileService.moveFile(currentFolder, trashFolder,
                        pathInfo.getFilenameWithoutExt(), pathInfo.getExtension());
            }
            if (!fileDeleteStatus) {
                logger.info("Error in deleting requested file: {}, currentUser: {}",
                        deleteFileReq, loginUserDetails);
                throw new AppException(ErrorCodes.RUNTIME_ERROR);
            } else {
                logger.info("Requested file deleted: {}.", deleteFileReq);
            }
        } else {
            logger.info("Requested deleteFile: {}, does not exist.", deleteFileReq);
            throw new AppException(ErrorCodes.FILE_NOT_FOUND);
        }
    }
    public Object handleDefaultUrl(HttpServletRequest request) {
        logger.info("Loading defaultMethod: {}", ((Request) request).getUri().toString());
        String requestedPath = StaticService.getPathUrl(request);
        PathInfo pathInfo = this.getFileResponse(requestedPath);
        Response.ResponseBuilder r;
        if (pathInfo!= null && AppConstant.FILE.equals(pathInfo.getType())) {
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
    private PathInfo getFileResponse(String filePath) {
        String publicDir = appConfig.getPublicDir();
        if (publicDir == null) {
            return null;
        }
        filePath = publicDir + filePath;
        PathInfo pathInfo = fileService.getPathInfo(filePath);
        if (AppConstant.FOLDER.equals(pathInfo.getType())) {
            pathInfo = fileService.searchIndexHtmlInFolder(pathInfo);
        }
        logger.info("PathDetails: {}", pathInfo);
        return pathInfo;
    }
    public ApiResponse doUpload(InputStream uploadedInputStream, String fileName) throws AppException {
        PathInfo pathInfo = fileService.getPathInfo(fileName);
        if (AppConstant.FILE.equals(pathInfo.getType())) {
            logger.info("Filename: {}, already exist, re-naming it. {}", fileName, pathInfo);
            String ext = pathInfo.getExtension();
            String parentFolder = pathInfo.getParentFolder();;
            String currentFileName = pathInfo.getFileName();
            String newFileName = pathInfo.getFilenameWithoutExt() + "-Copy." + ext;
            Boolean renameStatus = fileService.renameExistingFile(parentFolder, currentFileName, newFileName);
            if (!renameStatus) {
                String timeInMs = StaticService.getDateStrFromPattern(AppConstant.DateTimeFormat);
                newFileName = pathInfo.getFilenameWithoutExt() + "-" + timeInMs + "." + ext;
                fileService.renameExistingFile(parentFolder, currentFileName, newFileName);
            }
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
        if (ext == null || !supportedFileType.contains(ext.toLowerCase())) {
            logger.info("File extension '{}', is not supported", ext);
            throw new AppException(ErrorCodes.UNSUPPORTED_FILE_TYPE);
        }
        String dir = appConfig.getFtpConfiguration().getFileSaveDir();
        HashMap<String, String> values = new HashMap<>();
        values.put("username", loginUserName);
        values.put("filename", pathInfo.getFilenameWithoutExt());
        String uploadingFileName = dir + loginUserName + "/" +
                StaticService.generateStringFromFormat(appConfig, values) + "." + pathInfo.getExtension();
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
