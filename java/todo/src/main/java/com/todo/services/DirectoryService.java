package com.todo.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.todo.config.DirectoryConfig;
import com.todo.model.YamlObject;
import com.todo.utils.ErrorCodes;
import com.todo.utils.TodoException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.ArrayList;

/**
 * Created by shishupalkumar on 01/02/17.
 */
public class DirectoryService {
    private static Logger logger = LoggerFactory.getLogger(DirectoryService.class);
    private String directoryConfigPath;
    private String yamlObjectPath;
    public DirectoryService(String directoryConfigPath, String yamlObjectPath) {
        this.directoryConfigPath = directoryConfigPath;
        this.yamlObjectPath = yamlObjectPath;
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
    public DirectoryConfig getDirectoryConfig() {
        DirectoryConfig directoryConfig = null;
        ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
        try {
            directoryConfig = mapper.readValue(new File(directoryConfigPath), DirectoryConfig.class);
        } catch (IOException ioe) {
            logger.info("IOE : for file : {}", directoryConfigPath);
        }
        return directoryConfig;
    }
    public YamlObject getYamlObject() throws TodoException {
        YamlObject yamlObject = null;
        ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
        try {
            yamlObject = mapper.readValue(new File(yamlObjectPath), YamlObject.class);
        } catch (IOException ioe) {
            logger.info("IOE : for file : {}", yamlObjectPath);
            throw new TodoException(ErrorCodes.UNABLE_TO_PARSE_JSON);
        }
        return yamlObject;
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
    public BufferedReader getFile(ArrayList<String> folderPath, String fileName) throws TodoException {
        BufferedReader bufferedReader = null;
        for (String folder : folderPath) {
            try {
                bufferedReader = new BufferedReader(
                    new FileReader(folder + fileName));
                logger.info("File : {}, found in : {}",fileName, folder);
                break;
            } catch (IOException ioe) {
                logger.info("File : {}, not found in : {}",fileName, folder);
            }
        }
        if (bufferedReader == null) {
            logger.info("File : {}, not found in folderPath : {} : throws : {}",
                fileName, folderPath, ErrorCodes.FILE_NOT_FOUND.getErrorString());
            throw new TodoException(ErrorCodes.FILE_NOT_FOUND);
        }
        return bufferedReader;
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
