package com.todo.file.service;

import com.todo.TodoConfiguration;
import com.todo.constants.AppConstant;
import com.todo.file.constant.FilesConstant;
import com.todo.file.domain.FileDetails;
import com.todo.file.domain.PathType;
import com.todo.file.domain.ScanResult;
import com.todo.utils.ErrorCodes;
import com.todo.utils.StringUtils;
import com.todo.utils.TodoException;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
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
            pathName = pathName.length() < 1 ? scanResult.getPathName() : pathName;
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
    public ArrayList<String> createLinkV4(ArrayList<ScanResult> scanResults, Integer dirIndex) {
        ArrayList<String> allFileLink = new ArrayList<String>();
        if (scanResults == null) {
            logger.info("Invalid scanResults : null");
            return allFileLink;
        }
        String pathName;
        String[] pathArr;
        for (ScanResult scanResult : scanResults) {
            if (scanResult.getPathType() == PathType.FILE) {
                allFileLink.addAll(createLinkV2(scanResult));
            } else {
                pathArr = scanResult.getPathName().split(scanResult.getStaticFolderPath(), 2);
                pathName = pathArr[pathArr.length-1];
                pathName = pathName.length() < 1 ? scanResult.getPathName() : pathName;
                allFileLink.add("<a href=/files/v3/getAll/index/"+dirIndex+"/view?path=" +
                    StringUtils.urlEncode(pathName) + ">" + pathName + "</a>");
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
    private FileDetails getFileDetailsFromPath(String fileName, String path) {
        FileDetails fileDetails = new FileDetails();
        File file = new File(path);
        if (file.isFile()) {
            fileDetails.setFile(file);
            fileDetails.setFileName(fileName);
            fileDetails.setFilePath(path);
            String[] fileArray = fileName.split("\\.");
            if (fileArray.length > 1) {
                String fileExt = fileArray[fileArray.length - 1];
                fileDetails.setFileExtention(fileExt);
            }
            if (todoConfiguration.getDirectoryConfig().getMimeType().get(fileDetails.getFileExtention()) == null) {
                fileDetails.setFileMemType(MediaType.TEXT_HTML);
            } else {
                fileDetails.setFileMemType(todoConfiguration.getDirectoryConfig().getMimeType().get(
                    fileDetails.getFileExtention()));
            }
        } else {
            logger.info("fileName : {} is not a valid file and path : {}", fileName, path);
        }
        return fileDetails;
    }
    public FileDetails getStaticFileDetails(String fileName) throws TodoException {
        FileDetails fileDetails = new FileDetails();
        ArrayList<String> folderPath = todoConfiguration.getConfigService().getAppConfig().getUiPath();
        for (String folder : folderPath) {
            fileDetails = getFileDetailsFromPath(fileName, folder + fileName);
            if (fileDetails.getFile() != null) {
                logger.info("File : {}, found in : {}", fileName, folder);
                break;
            }
        }
        if (fileDetails.getFile() == null) {
            logger.info("File : {}, not found", fileName);
            throw new TodoException(ErrorCodes.FILE_NOT_FOUND);
        }
        return fileDetails;
    }
    public FileDetails getFileDetails(String fileName, Map<String, String> configFileMapper) throws TodoException {
        FileDetails fileDetails = new FileDetails();
        if (configFileMapper != null && configFileMapper.get(fileName) != null) {
            String filePath = configFileMapper.get(fileName);
            logger.info("File : {}, is configuration file, path : {}", fileName, filePath);
            fileDetails = getFileDetailsFromPath(filePath, filePath);
        } else {
            ArrayList<String> folderPath = todoConfiguration.getConfigService().getAppConfig().getRelativePath();
            for (String folder : folderPath) {
                fileDetails = getFileDetailsFromPath(fileName, folder + fileName);
                if (fileDetails.getFile() != null) {
                    logger.info("File : {}, found in : {}", fileName, folder);
                    break;
                }
            }
        }
        if (fileDetails.getFile() == null) {
            logger.info("File : {}, not found", fileName);
            throw new TodoException(ErrorCodes.FILE_NOT_FOUND);
        }
        return fileDetails;
    }
    public ArrayList<ScanResult> scanAllDirectory(boolean isRecursive) {
        ScanResult scanResult;
        ArrayList<ScanResult> scanResults = new ArrayList<ScanResult>();
        for (String scanDir : todoConfiguration.getConfigService().getAppConfig().getRelativePath()) {
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
    public String saveMessage(String message, String fileName, String ext,
                              boolean overWrite, Integer countTry) throws TodoException {
        logger.info("Save message : fileName = {} : countTry = {}", fileName, countTry);
        if (message == null) {
            logger.info("Message is null, can not be saved.");
            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        String response;
        Long timeInMs = System.currentTimeMillis();
        if (fileName == null) {
            fileName =  timeInMs.toString();
        }
        if (ext == null) {
            ext = ".txt";
        }
        String filePath = todoConfiguration.getConfigService().getAppConfig().getMessageSavePath() + fileName + ext;
        try {
            File file = new File(filePath);
            boolean fileCreated = file.createNewFile();
            countTry++;
            if (fileCreated) {
                FileWriter writer = new FileWriter(file);
                writer.write(message);
                writer.close();
                logger.info("Message saved in : {}", file);
                response = "Message saved";
            } else {
                if (countTry < 2) {
                    if (overWrite) {
                        logger.info("File already exist and overwrite is true, delete old file : {}", filePath);
                        BufferedReader in = new BufferedReader(
                            new InputStreamReader(
                                new FileInputStream(file), "UTF-8"));
                        logger.info("Deleted file data : ");
                        String str;
                        while ((str = in.readLine()) != null) {
                            logger.info(str);
                        }
                        in.close();
                        boolean fileDeleteStatus = file.delete();
                        logger.info("File deleted : {}", fileDeleteStatus);
                        response = saveMessage(message, fileName, ext, true, countTry);
                    } else {
                        logger.info("File create failed in first attempt, retry... : countTry : {}", countTry);
                        response = saveMessage(message, fileName + "-" + timeInMs.toString(), ext, false, countTry);
                    }
                } else {
                    logger.info("Unable to save message : {}, {}, {}, {}",
                            StringUtils.getLoggerObject(message, fileName, countTry, filePath));
                    throw new TodoException(ErrorCodes.SERVER_ERROR);
                }
            }
        } catch (Exception e) {
            response = "Error while saving message.";
            logger.info("Error saving message : {}, {}", filePath, e);
        }
        return response;
    }
    public String addNewLine(String text, String fileName) throws TodoException {
        logger.info("Add new line text : {}, in: fileName = {} : countTry = {}", text, fileName);
        if (text == null) {
            logger.info("Text is null, Not rquired to add new line.");
            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        if (fileName == null) {
            logger.info("Invalid fileName.");
            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        String pathName = todoConfiguration.getConfigService().getAppConfig().getAddTextPath();
        if (pathName == null) {
            logger.info("appConfig addTextPath is null.");
            throw new TodoException(ErrorCodes.CONFIG_ERROR);
        }
        String response = "Error";
        try {
            File file = new File(pathName + fileName);
            if (file.isFile()) {
                Writer writer = new BufferedWriter(new OutputStreamWriter(
                    new FileOutputStream(file, true), "UTF-8"));
                writer.append("\n");
                writer.append(text);
                writer.close();
                logger.info("Text {} added in : {}", text, fileName);
                response = "Success";
            } else {
                logger.info("File does not exist creating new file.");
                boolean fileCreated = file.createNewFile();
                if (fileCreated) {
                    logger.info("New file {} created.", fileName);
                    FileWriter writer = new FileWriter(file);
                    writer.write(text);
                    writer.close();
                    response = "Success";
                } else {
                    logger.info("Unable to create New file {}", fileName);
                }
            }
        } catch (Exception e) {
            logger.info("Error saving text : {}, in file : {}, {}", StringUtils.getLoggerObject(text, fileName, e));
        }
        return response;
    }
    public void isValidDir(String pathName, String logStr) throws TodoException {
        try {
            File folder = new File(pathName);
            if (folder.isFile()) {
                logger.info("{} is a file not directory : {}", logStr, pathName);
                throw new TodoException(ErrorCodes.CONFIG_ERROR_INVALID_PATH);
            }
            if (folder.listFiles() == null) {
                logger.info("{} path is invalid : {}", logStr, pathName);
                throw new TodoException(ErrorCodes.CONFIG_ERROR_INVALID_PATH);
            }
//            logger.info("{} path is verified : {}", logStr, pathName);
        } catch (Exception e) {
//            logger.info("{}", ErrorCodes.CONFIG_ERROR_INVALID_PATH.getErrorString());
            logger.info("Current working directory is : {}", System.getProperty("user.dir"));
            throw new TodoException(ErrorCodes.CONFIG_ERROR_INVALID_PATH);
        }
    }
    public String parseFilePath(String filePath) {
        if (filePath != null) {
            if (todoConfiguration.getDirectoryConfig().getPathReplaceString() != null) {
                logger.info("Path before replace : {}", filePath);
                for(Map.Entry<String, String> entry :
                    todoConfiguration.getDirectoryConfig().getPathReplaceString().entrySet()) {
                    logger.info("Replacing string : {}, to : {}", entry.getKey(), entry.getValue());
                    filePath = filePath.replace(entry.getKey(), entry.getValue());
                }
                logger.info("Path after replace : {}", filePath);
            }
        }
        return filePath;
    }
    public Object getJsonFileResponse (final String jsonFileRef) throws TodoException {
        Object obj = null;
        String fileName = null;
        JSONParser jsonParser = new JSONParser();
        if (jsonFileRef == null) {
            logger.info("Invalid request jsonFileRef : null");
            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        try {
            HashMap<String, String> jsonFileMapping = todoConfiguration.getConfigService()
                    .getAppConfig().getJsonFileMapping();
            if (jsonFileMapping == null) {
                logger.info("Invalid config jsonFileMapping : null");
            } else {
                fileName = jsonFileMapping.get(jsonFileRef);
                if (fileName == null) {
                    logger.info("Invalid request jsonFileRef: {}, in jsonFileMapping: {}",
                            jsonFileRef, jsonFileMapping);
                } else {
                    FileReader reader = new FileReader(fileName);
                    obj = jsonParser.parse(reader);
                    logger.info("Read json file {} for jsonFileRef {} is success",
                            fileName, jsonFileRef);
                }
            }
        } catch (FileNotFoundException e) {
            logger.info("File not found : {}, {}, {}", StringUtils.getLoggerObject(jsonFileRef, fileName, e));
        } catch (IOException e) {
            logger.info("IOExcpection for file : {}, {}, {}", StringUtils.getLoggerObject(jsonFileRef, fileName, e));
        } catch (ParseException e) {
            logger.info("ParseException for file : {}, {}, {}", StringUtils.getLoggerObject(jsonFileRef, fileName, e));
        } catch (Exception e) {
            logger.info("Unknown exception for jsonFileRef : {}, {}", jsonFileRef, e);
        }
        if (obj == null) {
            HashMap<String, String> objV2 = new HashMap<String, String>();
            objV2.put(AppConstant.STATUS, AppConstant.FAILURE);
            obj = objV2;
        }
        return obj;
    }
}
