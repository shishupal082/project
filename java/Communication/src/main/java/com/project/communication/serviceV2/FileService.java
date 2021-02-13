package com.project.communication.serviceV2;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;

import java.io.File;
import java.util.ArrayList;

public class FileService {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(FileService.class);
    public FileService() {}
    public ScanResult scanDirectory(String folderPath, String staticFolderPath, boolean isRecursive) {
        //folderPath and staticFolderPath should contain / in the end
        ScanResult finalFileScanResult = new ScanResult(staticFolderPath, folderPath);
        ScanResult fileScanResult = null;
        try {
            File folder = new File(folderPath);
            if (folder.isFile()) {
                finalFileScanResult = new ScanResult(staticFolderPath, folderPath, PathType.FILE);
//                logger.info("Given folder path is a file returning : {}", finalFileScanResult);
                return finalFileScanResult;
            }
            finalFileScanResult = new ScanResult(staticFolderPath, folderPath);
            File[] listOfFiles = folder.listFiles();
            if (listOfFiles != null) {
//                logger.info("Files in folder : {}, {}", folderPath, listOfFiles);
                finalFileScanResult.setPathType(PathType.FOLDER);
                finalFileScanResult.setScanResults(new ArrayList<ScanResult>());
                for (File file : listOfFiles) {
                    if (file.isFile()) {
                        fileScanResult = scanDirectory(folderPath + file.getName(),
                                staticFolderPath, false);
                    } else if (file.isDirectory()) {
                        if (isRecursive) {
                            fileScanResult = scanDirectory(folderPath + file.getName() + "/",
                                    staticFolderPath, true);
                        } else {
                            fileScanResult = new ScanResult(staticFolderPath,
                                    folderPath + file.getName() + "/", PathType.FOLDER);
                        }
                    } else {
                        logger.info("Unknown file type present :", file.getName());
                        continue;
                    }
                    finalFileScanResult.getScanResults().add(fileScanResult);
                }
            } else {
                logger.info("No files found in folder, listOfFiles=null: ", folderPath);
            }
        } catch (Exception e) {
            logger.info("Error fetching folder from :", folderPath);
        }
//        logger.info("Scan folder result for folder : {}, {}", folderPath, finalFileScanResult);
//        logger.info("Scan complete for folder :", folderPath);
        return finalFileScanResult;
    }

}
