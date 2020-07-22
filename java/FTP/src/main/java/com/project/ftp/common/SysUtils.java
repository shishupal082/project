package com.project.ftp.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.PrintWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;


public class SysUtils {
    final static Logger LOGGER = LoggerFactory.getLogger(SysUtils.class);
    public Long getTimeInMsLong() {
        return System.currentTimeMillis();
    }
    public String getProjectWorkingDir() {
        return System.getProperty("user.dir");
    }
    public void printLog(Object logStr) {
        System.out.println(logStr);
    }
    public Boolean deleteFileContent(String filePath) {
        boolean deleteFileContentStatus = false;
        try {
            PrintWriter pw = new PrintWriter(filePath);
            pw.close();
            deleteFileContentStatus = true;
        } catch (Exception e) {
            LOGGER.info("Error in deleting file content: filePath= '{}', {}", filePath, e);
        }
        return deleteFileContentStatus;
    }
}
