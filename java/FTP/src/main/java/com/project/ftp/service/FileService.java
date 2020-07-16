package com.project.ftp.service;

import com.project.ftp.common.SysUtils;
import com.project.ftp.config.AppConstant;
import com.project.ftp.config.PathType;
import com.project.ftp.obj.PathInfo;
import com.project.ftp.obj.ScanResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.ArrayList;

public class FileService {
    final static Logger logger = LoggerFactory.getLogger(FileService.class);
    public FileService() {}
    public PathInfo getPathInfo(String requestedPath) {
        PathInfo pathInfo = new PathInfo(requestedPath);
        File file = new File(requestedPath);
        if (file.isDirectory()) {
            pathInfo.setType(AppConstant.FOLDER);
        } else if(file.isFile()) {
            pathInfo.setType(AppConstant.FILE);
            pathInfo.setFileName(file.getName());
            String parentFolder = file.getParent().replaceAll("\\\\","/");
            pathInfo.setParentFolder(parentFolder);
            pathInfo.findExtension();
            pathInfo.findMimeType();
        }
        return pathInfo;
    }
    public PathInfo getPathInfoFromFileName(String fileName) {
        PathInfo pathInfo = new PathInfo();
        pathInfo.setType(AppConstant.FILE);
        pathInfo.setFileName(fileName);
        pathInfo.findExtension();
        pathInfo.findMimeType();
        return pathInfo;
    }
    public static PathInfo getPathDetails(String requestedPath) {
        FileService fileService = new FileService();
        return fileService.getPathInfo(requestedPath);
    }
    public boolean createFolder(String existingFolder, String currentFolderName) {
        File file = new File(existingFolder);
        boolean dirCreateStatus = false;
        if (file.isDirectory()) {
            file = new File((existingFolder + "/" + currentFolderName));
            if (file.mkdir()) {
                dirCreateStatus = true;
                logger.info("Directory '{}' created.", file.getPath());
            } else {
                logger.info("Error in creating directory '{}'.", file.getPath());
            }
        } else {
            logger.info("Existing path '{}' is not directory.", existingFolder);
        }
        return dirCreateStatus;
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
    public void renameExistingFile(String dir, String fileName, String ext) {
        logger.info("Rename request: dir={}, fileName={}", dir, fileName +"."+ ext);
        SysUtils sysUtils = new SysUtils();
        if (dir == null) {
            return;
        }
        if (ext == null) {
            ext = "txt";
        }
        String timeInMs = sysUtils.getDateTime(AppConstant.DateTimeFormat);
        if (timeInMs == null) {
            timeInMs = sysUtils.getTimeInMs();
        }
        String renameFilePath = dir + fileName + "-" + timeInMs + "." + ext;
        try {
            File file = new File(dir + fileName + "." + ext);
            File newFile = new File(renameFilePath);
            if (file.renameTo(newFile)) {
                String logStr = "fileName '{}' is already exist, renaming existing file with '{}'";
                logger.info(logStr, fileName + "." + ext, fileName + "-" + timeInMs + "." + ext);
            }
        } catch (Exception e) {
            logger.info("Error in renaming file '{}', {}", fileName + "." + ext, e);
        }
        return;
    }
    public PathInfo searchIndexHtmlInFolder(PathInfo pathInfo) {
        if (AppConstant.FOLDER.equals(pathInfo.getType())) {
            File file1 = new File(pathInfo.getPath() + "index.html");
            File file2 = new File(pathInfo.getPath() + "/index.html");
            File file = null;
            if (file1.isFile()) {
                file = file1;
            } else if (file2.isFile()) {
                file = file2;
            }
            if (file != null) {
                String pre = pathInfo.toString();
                pathInfo = getPathInfo(file.getPath());
                logger.info("PathInfo changes from folder to file: {} to {}", pre, pathInfo.toString());
            }
        }
        return pathInfo;
    }
    public PathInfo uploadFile(InputStream uploadedInputStream, String filePath) {
        logger.info("uploadFile request: {}", filePath);
        try {
            int read;
            final int BUFFER_LENGTH = 1024;
            final byte[] buffer = new byte[BUFFER_LENGTH];
            OutputStream out = new FileOutputStream(new File(filePath));
            while ((read = uploadedInputStream.read(buffer)) != -1) {
                out.write(buffer, 0, read);
            }
            out.flush();
            out.close();
        } catch (FileNotFoundException e1) {
            logger.info("FileNotFoundException in saving file: {}", e1.getMessage());
        } catch (IOException e2) {
            logger.info("IOException in saving file: {}", e2.getMessage());
        }
        return getPathInfo(filePath);
    }
}
