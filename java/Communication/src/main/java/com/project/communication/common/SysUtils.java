package com.project.communication.common;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.UUID;


public class SysUtils {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(SysUtils.class);
    private final static BufferedReader systemIn = new BufferedReader(new InputStreamReader(System.in));
    public SysUtils() {}
    public String readCommandLine() {
        String text = "";
        try {
            return systemIn.readLine();
        } catch (IOException e) {
            logger.info("IOException for reading command line");
        }
        return text;
    }
    public Long getTimeInMsLong() {
        return System.currentTimeMillis();
    }
    public String getProjectWorkingDir() {
        return System.getProperty("user.dir");
    }
    public Boolean deleteFileContent(String filePath) {
        boolean deleteFileContentStatus = false;
        try {
            PrintWriter pw = new PrintWriter(filePath);
            pw.close();
            deleteFileContentStatus = true;
        } catch (Exception e) {
            logger.info("Error in deleting file content: filePath= '{}', {}", filePath, e.getMessage());
        }
        return deleteFileContentStatus;
    }
    public String createUUIDNumber() {
        return UUID.randomUUID().toString();
    }
    public int getRandomNumber(int min, int max) {
        return (int) ((Math.random() * (max - min)) + min);
    }
}
