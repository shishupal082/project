package com.todo.services;

import com.todo.TodoConfiguration;
import com.todo.config.FilesConfig;
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
                allDownloadLink.add("<a href=/files/v1/download?name=" + fileName + ">" + fileName + "</a>");
            } else {
                logger.info("FileName : {}, is not a file", fileName);
            }
        }
        return allDownloadLink;
    }
    public ArrayList<String> createLink(ArrayList<String> allFiles, boolean isRelative) {
        ArrayList<String> allFileLink = new ArrayList<String>();
        for (String fileName : allFiles) {
            allFileLink.add("<a href=/files/v1/get?name=" + fileName + ">" + fileName + "</a>");
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
    public ArrayList<String> getAllFiles(String folderPath, String staticFolderPath, boolean removeFolderPath) {
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
