package com.todo.services;

import com.todo.config.TodoDirectoryConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.util.ArrayList;

/**
 * Created by shishupalkumar on 01/02/17.
 */
public class DirectoryService {
    private static Logger logger = LoggerFactory.getLogger(DirectoryService.class);
    private TodoDirectoryConfig todoDirectoryConfig;
    public DirectoryService(TodoDirectoryConfig todoDirectoryConfig) {
        this.todoDirectoryConfig = todoDirectoryConfig;
    }
    public ArrayList<String> createLink(ArrayList<String> allFiles, boolean isRelative) {
        ArrayList<String> allFileLink = new ArrayList<String>();
        String href = "";
        for (String fileName : allFiles) {
            if (isRelative) {
                href = "/files/v1/get?name=" + fileName;
            } else {
                href = fileName;
            }
            allFileLink.add("<a href=" + href + ">" + fileName + "</a>");
        }
        return allFileLink;
    }
    public ArrayList<String> getAllFiles(String folderPath, boolean removeFolderPath) {
        ArrayList<String> allFileList = new ArrayList<String>();
        String filePath = "";
        String[] fileParent;
        try {
            File folder = new File(folderPath);
            File[] listOfFiles = folder.listFiles();
            if (listOfFiles != null) {
                for (File file : listOfFiles) {
                    if (file.isFile()) {
                        if (removeFolderPath) {
                            fileParent = file.getPath().split(todoDirectoryConfig.getRelativePath(), 2);
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
                        allFileList.addAll(getAllFiles(file.getPath(), removeFolderPath));
                    } else {
                        logger.info("Unknown file type present : {}", file.getName());
                    }
                }
            }
        } catch (Exception e) {
            logger.info("Error fetching folder from : {}", folderPath);
            logger.info("{}", e);
        }
        return allFileList;
    }
}
