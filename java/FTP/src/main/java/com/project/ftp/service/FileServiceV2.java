package com.project.ftp.service;

import com.project.ftp.config.AppConfig;
import com.project.ftp.config.AppConstant;
import com.project.ftp.config.PathType;
import com.project.ftp.exceptions.ErrorCodes;
import com.project.ftp.obj.ApiResponse;
import com.project.ftp.obj.ScanResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.util.ArrayList;

public class FileServiceV2 {
    final static Logger logger = LoggerFactory.getLogger(FileServiceV2.class);
    final AppConfig appConfig;
    public FileServiceV2(final AppConfig appConfig) {
        this.appConfig = appConfig;
    }
    public ScanResult scanDirectory(String folderPath, String staticFolderPath, boolean isRecursive) {
        ScanResult finalFileScanResult = new ScanResult(staticFolderPath, folderPath);
        ScanResult fileScanResult = null;
        try {
            File folder = new File(folderPath);
            if (folder.isFile()) {
                finalFileScanResult = new ScanResult(staticFolderPath, folderPath, PathType.FILE);
                logger.info("Given folder path is a file returning : {}", finalFileScanResult);
                return finalFileScanResult;
            }
            finalFileScanResult = new ScanResult(staticFolderPath, folderPath);
            File[] listOfFiles = folder.listFiles();
            if (listOfFiles != null) {
                logger.info("Files in folder : {}, {}", folderPath, listOfFiles);
                finalFileScanResult.setPathType(PathType.FOLDER);
                finalFileScanResult.setScanResults(new ArrayList<ScanResult>());
                for (File file : listOfFiles) {
                    if (file.isFile()) {
                        fileScanResult = scanDirectory(folderPath + file.getName(), staticFolderPath, false);
                    } else if (file.isDirectory()){
                        if (isRecursive) {
                            fileScanResult = scanDirectory(folderPath + file.getName() + "/", staticFolderPath, true);
                        } else {
                            fileScanResult = new ScanResult(staticFolderPath,
                                    folderPath + file.getName() + "/", PathType.FOLDER);
                        }
                    } else {
                        logger.info("Unknown file type present : {}", file.getName());
                        continue;
                    }
                    finalFileScanResult.getScanResults().add(fileScanResult);
                }
            } else {
                logger.info("No files found in folder : {}, listOfFiles=null", folderPath);
            }
        } catch (Exception e) {
            logger.info("Error fetching folder from : {}, {}", folderPath, e);
        }
        logger.info("Scan folder result for folder : {}, {}", folderPath, finalFileScanResult);
        return finalFileScanResult;
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
                scanResults.add(scanDirectory(dir, dir, true));
            } else {
                dir += loginUserName + "/";
                scanResults.add(scanDirectory(dir, dir, false));
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
                scanResult = scanDirectory(filePath, filePath, false);
                logger.info("Scan result: {}", scanResult);
            }
        } else {
            logger.info("Invalid filename:{}", filename);
        }
        return scanResult;
    }
}
