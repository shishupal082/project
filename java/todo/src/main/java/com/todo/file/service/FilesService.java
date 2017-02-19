package com.todo.file.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.todo.TodoConfiguration;
import com.todo.file.config.FilesConfig;
import com.todo.file.constant.FilesConstant;
import com.todo.file.domain.FileDetails;
import com.todo.file.domain.ScanResult;
import com.todo.file.domain.PathType;
import com.todo.utils.ErrorCodes;
import com.todo.utils.StringUtils;
import com.todo.utils.TodoException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.core.MediaType;
import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by shishupalkumar on 01/02/17.
 */
public class FilesService {
    private static Logger logger = LoggerFactory.getLogger(FilesService.class);
    private TodoConfiguration todoConfiguration;
    public FilesService(TodoConfiguration todoConfiguration) {
        this.todoConfiguration = todoConfiguration;
    }
    public FilesConfig updateFileConfig() {
        FilesConfig filesConfig = null;
        ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
        String directoryConfigPath = todoConfiguration.getTodoDirectoryConfigPath();
        try {
            filesConfig = mapper.readValue(new File(directoryConfigPath),
                FilesConfig.class);
        } catch (IOException ioe) {
            logger.info("IOE : for file : {}", directoryConfigPath);
        }
        todoConfiguration.setFilesConfig(filesConfig);
        logger.info("TodoConfiguration : FilesConfig : updated");
        return filesConfig;
    }
    public static FilesConfig updateFileConfig(TodoConfiguration todoConfiguration) {
        FilesService filesService = new FilesService(todoConfiguration);
        filesService.updateFileConfig();
        return todoConfiguration.getFilesConfig();
    }
    public ArrayList<ScanResult> filterFilesByExtention(ArrayList<ScanResult> scanResults,
                                                        ArrayList<String> requiredFileTypes) {
        ArrayList<ScanResult> filteredFiles = new ArrayList<ScanResult>();
        if (scanResults == null || requiredFileTypes == null) {
            return filteredFiles;
        }
        String[] fileNameArray;
        for (ScanResult scanResult : scanResults) {
            fileNameArray = scanResult.getPathName().split("\\.");
            if (fileNameArray.length > 0) {
                if (requiredFileTypes.contains(fileNameArray[fileNameArray.length - 1])) {
                    filteredFiles.add(scanResult);
                }
            }
        }
        logger.info("Input files count : {}, output files count : {}", scanResults.size(), filteredFiles.size());
        return filteredFiles;
    }
    private boolean isValidScanResult(ScanResult scanResult) {
        if (scanResult == null || scanResult.getPathType() == null ||
            scanResult.getPathName() == null || scanResult.getStaticFolderPath() == null) {
            return false;
        }
        return true;
    }
    public ArrayList<String> createLinkV2(ScanResult scanResult) {
        ArrayList<String> allFileLink = new ArrayList<String>();
        if (!isValidScanResult(scanResult)) {
            logger.info("Invalid scanResult : {}", scanResult);
            return allFileLink;
        }
        String fileName, pathName;
        String[] pathArr, fileArr;
        if (scanResult.getPathType() == PathType.FILE) {
            pathArr = scanResult.getPathName().split(scanResult.getStaticFolderPath(), 2);
            pathName = pathArr[pathArr.length-1];
            fileArr = scanResult.getPathName().split("/");
            fileName = fileArr[fileArr.length - 1];
            allFileLink.add("<a href=" + FilesConstant.fileViewUrl + StringUtils.urlEncode(fileName) + "?name=" +
                StringUtils.urlEncode(pathName) + ">" + pathName + "</a>");
        } else {
            ArrayList<ScanResult> scanResults = scanResult.getScanResults();
            if (scanResults != null) {
                for (ScanResult scanResult1 : scanResults) {
                    allFileLink.addAll(createLinkV2(scanResult1));
                }
            }
        }
        return allFileLink;
    }
    public ArrayList<String> createLinkV3(ArrayList<ScanResult> scanResults) {
        ArrayList<String> allFileLink = new ArrayList<String>();
        if (scanResults == null) {
            logger.info("Invalid scanResults : null");
            return allFileLink;
        }
        for (ScanResult scanResult : scanResults) {
            allFileLink.addAll(createLinkV2(scanResult));
        }
        return allFileLink;
    }
    public FileDetails getFileDetails(String fileName) throws TodoException {
        FileDetails fileDetails = new FileDetails();
        FilesConfig filesConfig = todoConfiguration.getFilesConfig();
        ArrayList<String> folderPath = filesConfig.getRelativePath();
        for (String folder : folderPath) {
            File file = new File(folder + fileName);
            if (file.isFile()) {
                fileDetails.setFile(file);
                fileDetails.setFileName(fileName);
                fileDetails.setFilePath(folder + fileName);
                String[] fileArray = fileName.split("\\.");
                if (fileArray.length > 1) {
                    String fileExt = fileArray[fileArray.length - 1];
                    fileDetails.setFileExtention(fileExt);
                }
                if (filesConfig.getMimeType().get(fileDetails.getFileExtention()) == null) {
                    fileDetails.setFileMemType(MediaType.TEXT_HTML);
                } else {
                    fileDetails.setFileMemType(filesConfig.getMimeType().get(fileDetails.getFileExtention()));
                }
                logger.info("File : {}, found in : {}", fileName, folder);
                break;
            }
        }
        if (fileDetails.getFileName() == null) {
            logger.info("File : {}, not found", fileName);
            throw new TodoException(ErrorCodes.FILE_NOT_FOUND);
        }
        return fileDetails;
    }
    public ArrayList<ScanResult> scanAllDirectory(boolean isRecursive) {
        ScanResult scanResult;
        ArrayList<ScanResult> scanResults = new ArrayList<ScanResult>();
        for (String scanDir : todoConfiguration.getFilesConfig().getRelativePath()) {
            scanResult = scanDirectory(scanDir, scanDir, isRecursive);
            scanResults.add(scanResult);
        }
        return scanResults;
    }
    private ArrayList<ScanResult> filterFilesFromScanResult(ScanResult scanResult) {
        ArrayList<ScanResult> totalFiles = new ArrayList<ScanResult>();
        if (scanResult == null) {
            logger.info("Invalid scanResult : null");
            return totalFiles;
        }
        if (scanResult.getPathType() == PathType.FILE) {
            totalFiles.add(scanResult);
        } else {
            ArrayList<ScanResult> scanResults = scanResult.getScanResults();
            if (scanResults != null) {
                for (ScanResult scanResult1 : scanResults) {
                    totalFiles.addAll(filterFilesFromScanResult(scanResult1));
                }
            }
        }
        return totalFiles;
    }
    public ArrayList<ScanResult> getAllFilesFromScanedDirectory(ArrayList<ScanResult> scanResultAllDirecotry) {
        ArrayList<ScanResult> allFiles = new ArrayList<ScanResult>();
        ArrayList<ScanResult> response = new ArrayList<ScanResult>();
        if (scanResultAllDirecotry == null) {
            logger.info("No file found.");
            return allFiles;
        }
        for(ScanResult scanResult : scanResultAllDirecotry) {
            allFiles.addAll(filterFilesFromScanResult(scanResult));
        }
        for(ScanResult scanResult : allFiles) {
            if (scanResult.getPathType() != PathType.FILE) {
                logger.info("Invalid file types added : {}", scanResult);
                continue;
            }
            response.add(scanResult);
        }
        return response;
    }
    public ScanResult scanDirectory(String folderPath, String staticFolderPath, boolean isRecursive) {
        ScanResult finalFileScanResult = new ScanResult(staticFolderPath, folderPath), fileScanResult = null;
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
}
