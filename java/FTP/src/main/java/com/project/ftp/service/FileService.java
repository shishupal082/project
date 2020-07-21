package com.project.ftp.service;

import com.project.ftp.common.SysUtils;
import com.project.ftp.config.AppConstant;
import com.project.ftp.config.PathType;
import com.project.ftp.exceptions.AppException;
import com.project.ftp.exceptions.ErrorCodes;
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
        if (requestedPath == null) {
            requestedPath = "";
        }
        PathInfo pathInfo = new PathInfo(requestedPath);
        File file = new File(requestedPath);
        if (file.isDirectory()) {
            pathInfo.setType(AppConstant.FOLDER);
        } else if(file.isFile()) {
            pathInfo.setType(AppConstant.FILE);
            pathInfo.setFileName(file.getName());
            String parentFolder = file.getParent().replaceAll("\\\\","/");
            pathInfo.setParentFolder(parentFolder); // It does not contain "/" in the end
            pathInfo.findExtension();
            pathInfo.findMimeType();
        }
        return pathInfo;
    }
    private Boolean copyFile(File src, File dest) {
        InputStream is = null;
        OutputStream os = null;
        try {
            is = new FileInputStream(src);
            os = new FileOutputStream(dest);
            byte[] buf = new byte[1024];
            int bytesRead;
            while ((bytesRead = is.read(buf)) > 0) {
                os.write(buf, 0, bytesRead);
            }
            is.close();
            os.close();
            logger.info("File copy success.");
            return true;
        } catch (Exception e) {
            logger.info("Error in copy file.");
        }
        return false;
    }
    public Boolean moveFile(String source, String destination, String filename, String ext) {
        // Here source and destination both does not contain / in the end
        if (source == null || destination == null || filename == null || ext == null) {
            logger.info("Invalid request to moveFile: {}", source + "--" + destination + "--"
                            + filename + "--" + ext);
            return false;
        }
        String sourceFilePath = source + "/" + filename + ".ext";
        String destinationFilePath = destination + "/" + filename + "." + ext;
        if (this.isFile(destinationFilePath)) {
            logger.info("filename: {}, exist in the folder, renaming it.", destinationFilePath);
            this.renameExistingFile(destination, filename, ext);
        }
        File src = new File(sourceFilePath);
        File dest = new File(destinationFilePath);
        Boolean r = copyFile(src, dest);
        this.deleteFileV2(sourceFilePath);
        return r;
    }
    public String createDir(ArrayList<String> dirs) {
        if (dirs == null || dirs.isEmpty()) {
            return null;
        }
        // First element must contain / (slash) in the path
        String dirStr = dirs.get(0);
        if (!this.isDirectory(dirStr)) {
            return null;
        }
        for (int i=1; i<dirs.size(); i++) {
            if (!this.isDirectory(dirStr + dirs.get(i) + "/")) {
                if (!this.createFolder(dirStr, dirs.get(i))) {
                    return null;
                }
            }
            dirStr += dirs.get(i) + "/";
        }
        dirStr = StaticService.replaceLast("/", "", dirStr);
        return dirStr;
    }
    public Boolean isDirectory(String path) {
        if (path == null) {
            return false;
        }
        File file = new File(path);
        return  file.isDirectory();
    }
    public Boolean isFile(String path) {
        if (path == null) {
            return false;
        }
        File file = new File(path);
        return file.isFile();
    }
    public PathInfo getPathInfoFromFileName(String fileName) {
        PathInfo pathInfo = new PathInfo();
        pathInfo.setType(AppConstant.FILE);
        pathInfo.setFileName(fileName);
        pathInfo.findExtension();
        pathInfo.findMimeType();
        return pathInfo;
    }
    public boolean createFolder(String existingFolder, String currentFolderName) {
        if (existingFolder == null) {
            return false;
        }
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
        //ext = ""; is also working
        logger.info("Rename request: dir={}, fileName={}", dir, fileName +"."+ ext);
        if (dir == null || fileName == null || ext == null) {
            String logStr = "Invalid rename request: dir="+dir;
            logger.info(logStr + ", fileName={}, ext={}", fileName, ext);
            return;
        }
        File file = new File(dir + "/" + fileName + "." + ext);
        if (!file.isFile()) {
            logger.info("Request rename file does not exist.");
            return;
        }
        SysUtils sysUtils = new SysUtils();
        String timeInMs = sysUtils.getDateTime(AppConstant.DateTimeFormat);
        if (timeInMs == null) {
            timeInMs = sysUtils.getTimeInMs();
        }
        String renameFilePath = dir + "/" + fileName + "-" + timeInMs + "." + ext;
        try {
            File newFile = new File(renameFilePath);
            if (file.renameTo(newFile)) {
                String logStr = "fileName '{}' is already exist, renaming existing file with '{}'";
                logger.info(logStr, fileName + "." + ext, fileName + "-" + timeInMs + "." + ext);
            } else {
                logger.info("Rename fail: from {}, to {}", file.getPath(), newFile.getPath());
            }
        } catch (Exception e) {
            logger.info("Error in renaming file '{}', {}", fileName + "." + ext, e);
        }
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
    public Boolean deleteFileV2(String filePath) {
        if (filePath == null) {
            return false;
        }
        File file = new File(filePath);
        if (file.isFile()) {
            return file.delete();
        } else {
            logger.info("{}, is not a file.", filePath);
        }
        return false;
    }
    private void deleteFile(String filePath) {
        if (filePath == null) {
            return;
        }
        File file = new File(filePath);
        if (file.isFile()) {
            if (file.delete()) {
                logger.info("File deleted: {}", filePath);
            } else {
                logger.info("Error in file delete: {}", filePath);
                PathInfo pathInfo = getPathInfo(filePath);
                renameExistingFile(pathInfo.getParentFolder(),
                        pathInfo.getFilenameWithoutExt(), pathInfo.getExtension());
            }
        }
    }
    public PathInfo uploadFile(InputStream uploadedInputStream, String filePath, Integer maxFileSize) throws AppException {
        logger.info("uploadFile request: {}", filePath);
        if (maxFileSize == null || maxFileSize < 1) {
            logger.info("Invalid maxFileSize in ftp env configuration: {}", maxFileSize);
            throw new AppException(ErrorCodes.CONFIG_ERROR);
        }
        try {
            int read;
            int fileSize = 0;
            final int BUFFER_LENGTH = 1024;
            final byte[] buffer = new byte[BUFFER_LENGTH];
            OutputStream out = new FileOutputStream(new File(filePath));
            while ((read = uploadedInputStream.read(buffer)) != -1) {
                out.write(buffer, 0, read);
                fileSize += read;
                if (fileSize >= maxFileSize) {
                    logger.info("fileSize = {} exceed than maxFileSize = {}", fileSize, maxFileSize);
                    out.flush();
                    out.close();
                    deleteFile(filePath);
                    throw new AppException(ErrorCodes.FILE_SIZE_EXCEEDED);
                }
            }
            out.flush();
            out.close();
            logger.info("fileSize = {}, uploaded file: {}", fileSize, filePath);
        } catch (FileNotFoundException e1) {
            logger.info("FileNotFoundException in saving file: {}", e1.getMessage());
            throw new AppException(ErrorCodes.RUNTIME_ERROR);
        } catch (IOException e2) {
            logger.info("IOException in saving file: {}", e2.getMessage());
            throw new AppException(ErrorCodes.RUNTIME_ERROR);
        }
        return getPathInfo(filePath);
    }
}
