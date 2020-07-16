package com.project.ftp.service;

import com.project.ftp.config.AppConfig;
import com.project.ftp.config.PathType;
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

    public ArrayList<ScanResult> scanAllDirectory(final UserService userService) {
        ArrayList<ScanResult> result = new ArrayList<>();
        String dir = appConfig.getFtpConfiguration().getFileSaveDir();
        Boolean isLoginUserAdmin = userService.isLoginUserAdmin();
        String userName = userService.getLoginUserName();
        if (isLoginUserAdmin) {
            result.add(scanDirectory(dir, dir, true));
        } else {
            dir += userName;
            result.add(scanDirectory(dir, dir, false));
        }
        return result;
    }
    public ScanResult searchRequestedFile(final UserService userService, String filename) {
        if (filename == null) {
            filename = "";
        }
        String dir = appConfig.getFtpConfiguration().getFileSaveDir();
        Boolean isLoginUserAdmin = userService.isLoginUserAdmin();
        String loginUserName = userService.getLoginUserName();
        String[] filenameArr = filename.split("/");
        String filePath = dir;
        ScanResult scanResult = null;
        if (filenameArr.length == 2) {
            if (loginUserName.isEmpty()) {
                logger.info("Invalid loginUserName: {}", loginUserName);
                return null;
            }
            if (isLoginUserAdmin) {
                filePath += filename;
            } else {
                filePath += loginUserName + "/" + filenameArr[1];
            }
            scanResult = scanDirectory(filePath, filePath, false);
            logger.info("Scan result: {}", scanResult);
        } else {
            logger.info("Invalid filename:{}", filename);
        }
        return scanResult;
    }
}
