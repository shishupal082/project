package com.todo.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.todo.constants.AppConstant;
import com.todo.utils.SystemUtils;
import com.todo.yaml.todo.FileConfig;

import java.io.File;

public class LoggingHelper {
    private static ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
    private SystemUtils systemUtils;
    public LoggingHelper() {
        systemUtils = new SystemUtils();
    }
    public FileConfig getCustomLogging(String customLogginPath) {
        FileConfig FileConfig = null;
        try {
            FileConfig = mapper.readValue(new File(customLogginPath), FileConfig.class);
        } catch (Exception e) {
            SystemUtils.printLog(e);
            SystemUtils.printLog("Current working directory:" + systemUtils.getProjectWorkingDir());
        }
        return FileConfig;
    }
    public Boolean doLoggingSetup(String customLogginPath) {
        Boolean loggingSetupStatus = true;
        FileConfig FileConfig = getCustomLogging(customLogginPath);
        String timeInMs = systemUtils.getDateTime(AppConstant.DateTimeFormat);
        if (timeInMs == null) {
            timeInMs = systemUtils.getTimeInMs();
        }
        if (FileConfig != null) {
            String oldFilePath = FileConfig.getDirectory() +
                    FileConfig.getFileName() + FileConfig.getExtention();
            String newFilePath = FileConfig.getDirectory() +
                    FileConfig.getFileName() + "-" + timeInMs + FileConfig.getExtention();
            Boolean copyFileStatus = true;
            Boolean deleteFileContentStatus = true;
            if (systemUtils.isFileExist(oldFilePath)) {
                copyFileStatus = systemUtils.copyFile(oldFilePath, newFilePath);
                if (!copyFileStatus) {
                    SystemUtils.printLog("Error in copying file: source=" +
                            oldFilePath + " to destination:" + newFilePath);
                }
                deleteFileContentStatus = systemUtils.deleteFileContent(oldFilePath);
                if (!deleteFileContentStatus) {
                    SystemUtils.printLog("Error in deleting file content: source=" + oldFilePath);
                }
                loggingSetupStatus = copyFileStatus & deleteFileContentStatus;
            } else {
                SystemUtils.printLog("Old log file does not exist: source(dir/filename.ext)=" + oldFilePath);
            }
        } else {
            loggingSetupStatus = false;
            SystemUtils.printLog("FileConfig parameters are null");
        }
        return loggingSetupStatus;
    }
    public Boolean isValidLoggingSetup(String customLogginPath, String currentLogFilename) {
        Boolean loggingVerifyStatus = true;
        FileConfig FileConfig = getCustomLogging(customLogginPath);
        if (FileConfig == null) {
            loggingVerifyStatus = false;
            SystemUtils.printLog("FileConfig parameters are null");
        } else {
            String currentLogFilenameV2 = FileConfig.getDirectory() +
                    FileConfig.getFileName() + FileConfig.getExtention();
            loggingVerifyStatus = currentLogFilenameV2.equals(currentLogFilename);
            if (!loggingVerifyStatus) {
                SystemUtils.printLog("customLoggingPath:" + currentLogFilenameV2 +
                        " and currentLogFilename:" + currentLogFilename + " are not equal.");
            }
        }
        return loggingVerifyStatus;
    }
}
