package com.todo.file.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.todo.TodoConfiguration;
import com.todo.file.config.FilesConfig;
import com.todo.file.domain.ScanResult;
import com.todo.file.domain.PathType;
import com.todo.utils.StringUtils;
import com.todo.utils.TodoException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
    public ArrayList<String> filterFiles(ArrayList<String> allFiles, String fileType) {
        ArrayList<String> filteredFiles = new ArrayList<String>();
        for (String fileName : allFiles) {
            String[] fileNameArray = fileName.split("\\.");
            if (fileNameArray.length > 0) {
                if (fileNameArray[fileNameArray.length - 1].equals(fileType)) {
                    filteredFiles.add(fileName);
                }
            }
        }
        return filteredFiles;
    }
    public ArrayList<String> createDownloadLink(ArrayList<String> allFiles) {
        ArrayList<String> allDownloadLink = new ArrayList<String>();
        for (String fileName : allFiles) {
            if ((Boolean)getFileStatus(
                todoConfiguration.getFilesConfig().getRelativePath(), fileName).get("status")) {
                allDownloadLink.add("<a href=/files/v1/download?name=" + StringUtils.urlEncode(fileName)
                    + ">" + fileName + "</a>");
            } else {
                logger.info("FileName : {}, is not a file", fileName);
            }
        }
        return allDownloadLink;
    }
    public ArrayList<String> createLink(ArrayList<String> allFiles, boolean isRelative) {
        ArrayList<String> allFileLink = new ArrayList<String>();
        String file = "";
        String[] fileArr = null;
        for (String fileName : allFiles) {
            fileArr = fileName.split("/");
            file = fileArr[fileArr.length - 1];
            allFileLink.add("<a href=/files/v1/get/" + StringUtils.urlEncode(file) + "?name=" +
                StringUtils.urlEncode(fileName) + ">" + fileName + "</a>");
        }
        return allFileLink;
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
            allFileLink.add("<a href=/files/v1/get/" + StringUtils.urlEncode(fileName) + "?name=" +
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
    public Map<String, Object> getFileStatus(ArrayList<String> folderPath, String fileName) throws TodoException {
        HashMap<String, Object> fileStatus = new HashMap<String, Object>();
        fileStatus.put("status", false);
        for (String folder : folderPath) {
            if (new File(folder + fileName).isFile()) {
                fileStatus.put("status", true);
                fileStatus.put("path", folder + fileName);
                logger.info("File : {}, found in : {}",fileName, folder);
                break;
            }
        }
        return fileStatus;
    }
    public ArrayList<String> getAllFilesV2() {
        FilesConfig filesConfig = todoConfiguration.getFilesConfig();
        ArrayList<String> allFiles = new ArrayList<String>();
        for (String folderPath : filesConfig.getRelativePath()) {
            logger.info("Searching files in : {}", folderPath);
            allFiles.addAll(getAllFiles(folderPath, folderPath, true));
        }
        return allFiles;
    }
    public ScanResult getAllFilesV3(String folderPath, String staticFolderPath, boolean isRecursive) {
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
                        fileScanResult = getAllFilesV3(folderPath + file.getName(), staticFolderPath, false);
                    } else if (file.isDirectory()){
                        if (isRecursive) {
                            fileScanResult = getAllFilesV3(folderPath + file.getName() + "/", staticFolderPath, true);
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
    private ArrayList<String> getAllFiles(String folderPath, String staticFolderPath, boolean removeFolderPath) {
        ArrayList<String> allFileList = new ArrayList<String>();
        String filePath = "";
        String[] fileParent;
        try {
            File folder = new File(folderPath);
            File[] listOfFiles = folder.listFiles();
            logger.info("Files in folder : {}, {}", folderPath, listOfFiles);
            if (listOfFiles != null) {
                for (File file : listOfFiles) {
                    if (file.isFile()) {
                        if (removeFolderPath) {
                            fileParent = file.getPath().split(staticFolderPath, 2);
                            if (fileParent.length > 1) {
                                filePath = fileParent[1];
                            } else {
                                filePath = file.getPath();
                            }
                        } else {
                            filePath = file.getPath();
                        }
                        allFileList.add(filePath);
                    } else if (file.isDirectory()){
                        allFileList.addAll(getAllFiles(file.getPath(), staticFolderPath, removeFolderPath));
                    } else {
                        logger.info("Unknown file type present : {}", file.getName());
                    }
                }
            } else {
                logger.info("No files found in folder : {}, listOfFiles=null", folderPath);
            }
        } catch (Exception e) {
            logger.info("Error fetching folder from : {}, {}", folderPath, e);
        }
        return allFileList;
    }
}
