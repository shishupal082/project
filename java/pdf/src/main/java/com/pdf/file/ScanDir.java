package com.pdf.file;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.util.ArrayList;


public class ScanDir {
    private static Logger logger = LoggerFactory.getLogger(ScanDir.class);
    public ScanDir() {}
    public ScanResult scanResult(String folderPath,  boolean isRecursive) {
        ScanResult finalFileScanResult = new ScanResult(folderPath);
        ScanResult fileScanResult;
        String fileName;
        try {
            File folder = new File(folderPath);
            if (folder.isFile()) {
                fileName = folderPath;
                finalFileScanResult = new ScanResult(fileName,  ScanResultType.FILE);
                logger.info("Given folder path is a file returning : {}", finalFileScanResult);
                return finalFileScanResult;
            }
            finalFileScanResult = new ScanResult(folderPath);
            File[] listOfFiles = folder.listFiles();
            if (listOfFiles != null) {
                logger.info("Files in folder : {}, {}", folderPath, listOfFiles);
                finalFileScanResult.setResultType(ScanResultType.FOLDER);
                finalFileScanResult.setScanResults(new ArrayList<ScanResult>());
                for (File file : listOfFiles) {
                    if (file.isFile()) {
                        fileScanResult = new ScanResult(folderPath, file.getName(), ScanResultType.FILE);
                    } else if (file.isDirectory()){
                        if (!isRecursive) {
                            fileScanResult = new ScanResult(folderPath + file.getName() + "/");
                            fileScanResult.setResultType(ScanResultType.FOLDER);
                        } else {
                            fileScanResult = scanResult(folderPath + file.getName() + "/", true);
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
}
