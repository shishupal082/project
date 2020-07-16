package com.project.ftp.common;

import com.project.ftp.config.AppConstant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;


public class SysUtils {
    final static Logger LOGGER = LoggerFactory.getLogger(SysUtils.class);
    public String getDateTime(String pattern) {
        String response = null;
        Date currentDate = new Date();
        try {
            DateFormat dateFormat = new SimpleDateFormat(pattern);
            response = dateFormat.format(currentDate);
        } catch (Exception e) {
            LOGGER.info("Unable to get formated date for pattern : {}, {}", pattern, e);
        }
        return response;
    }
    public String getTimeInMs() {
        Long currentTimeInMs = System.currentTimeMillis();
        return currentTimeInMs.toString();
    }
    public String getFormatedTimeInMs() {
        String dateTime = getDateTime(AppConstant.DateTimeFormat);
        if (dateTime == null) {
            dateTime = getTimeInMs();
        }
        return dateTime;
    }
    public String getProjectWorkingDir() {
        return System.getProperty("user.dir");
    }
    public Boolean isFileExist(String filePath) {
        Boolean isFileExist = false;
        try {
            File file = new File(filePath);
            if (file.isFile()) {
                isFileExist = true;
            }
        } catch (Exception e) { }
        return isFileExist;
    }
    public Boolean isValidDirectory(String pathName) {
        Boolean isValidDirectory = false;
        try {
            File folder = new File(pathName);
            if (folder.listFiles() == null) {
                LOGGER.info("Directory {} does not exist", pathName);
            } else {
                isValidDirectory = true;
            }
        } catch (Exception e) {
            LOGGER.info("Current working directory is : {}, {}", getProjectWorkingDir(), e);
        }
        if (!isValidDirectory) {
            LOGGER.info("Current working directory is : {}", getProjectWorkingDir());
        }
        return isValidDirectory;
    }
    public Boolean copyFile(String oldFilePath, String newFilePath) {
        Boolean fileCopyStatus = false;
        InputStream is = null;
        OutputStream os = null;
        try {
            File file = new File(oldFilePath);
            File newFile = new File(newFilePath);
            is = new FileInputStream(file);
            os = new FileOutputStream(newFile);
            byte[] buffer = new byte[1024];
            int length;
            while ((length = is.read(buffer)) > 0) {
                os.write(buffer, 0, length);
            }
            is.close();
            os.close();
            fileCopyStatus = true;
        } catch (Exception e) {
            LOGGER.info("Error in copy file '{}', {}", oldFilePath, e);
        }
        return fileCopyStatus;
    }
    public Boolean deleteFileContent(String filePath) {
        Boolean deleteFileContentStatus = false;
        try {
            PrintWriter pw = new PrintWriter(filePath);
            pw.close();
            deleteFileContentStatus = true;
        } catch (Exception e) {
            LOGGER.info("Error in deleting file content: filePath= '{}', {}", filePath, e);
        }
        return deleteFileContentStatus;
    }
    public static String getProjectWorkingDirV2() {
        SysUtils sysUtils = new SysUtils();
        return sysUtils.getProjectWorkingDir();
    }
    public static Boolean isValidDirectoryV2(String pathName) {
        SysUtils sysUtils = new SysUtils();
        return sysUtils.isValidDirectory(pathName);
    }
    public static Boolean isFileExistV2(String filePath) {
        SysUtils sysUtils = new SysUtils();
        return sysUtils.isFileExist(filePath);
    }
    public static String getFormatedTimeInMsV2() {
        SysUtils sysUtils = new SysUtils();
        return sysUtils.getFormatedTimeInMs();
    }
    public static void printLog(Object logStr) {
        System.out.println(logStr);
    }
}
