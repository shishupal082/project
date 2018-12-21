package com.todo.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;


public class SystemUtils {
    private static Logger LOGGER = LoggerFactory.getLogger(SystemUtils.class);
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
        return isValidDirectory;
    }
    public static String getProjectWorkingDirV2() {
        SystemUtils systemUtils = new SystemUtils();
        return systemUtils.getProjectWorkingDir();
    }
    public static Boolean isValidDirectoryV2(String pathName) {
        SystemUtils systemUtils = new SystemUtils();
        return systemUtils.isValidDirectory(pathName);
    }
    public static Boolean isFileExistV2(String filePath) {
        SystemUtils systemUtils = new SystemUtils();
        return systemUtils.isFileExist(filePath);
    }
}
