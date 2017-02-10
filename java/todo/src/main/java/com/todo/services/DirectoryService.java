package com.todo.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.todo.config.TodoDirectoryConfig;
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
    private TodoDirectoryConfig todoDirectoryConfig;
    public DirectoryService(TodoDirectoryConfig todoDirectoryConfig) {
        this.todoDirectoryConfig = todoDirectoryConfig;
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
    public YamlObject getYamlObject() throws TodoException {
        YamlObject yamlObject = null;
        ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
        try {
            yamlObject = mapper.readValue(new File(todoDirectoryConfig.getYamlObject()), YamlObject.class);
        } catch (IOException ioe) {
            logger.info("IOE : for file : {}", todoDirectoryConfig.getYamlObject());
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
    public BufferedReader getFile(ArrayList<String> folderPath, String fileName) throws FileNotFoundException {
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
            logger.info("File : {}, not found in folderPath : {} : throws : FileNotFoundException",
                fileName, folderPath);
            throw new FileNotFoundException("File not found");
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
            }
        } catch (Exception e) {
            logger.info("Error fetching folder from : {}", folderPath);
            logger.info("{}", e);
        }
        return allFileList;
    }
}
