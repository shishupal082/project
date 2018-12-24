package com.todo.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.todo.constants.AppConstant;
import com.todo.utils.SystemUtils;
import com.todo.yaml.todo.CustomLogging;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;

public class LoggingHelper {
    private static ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
    public CustomLogging getCustomLogging(String customLogginPath) {
        CustomLogging customLogging = null;
        try {
            customLogging = mapper.readValue(new File(customLogginPath), CustomLogging.class);
        } catch (Exception e) {
            System.out.println(e);
        }
        return customLogging;
    }
    public void doLoggingSetup(String customLogginPath) {
        SystemUtils systemUtils = new SystemUtils();
        CustomLogging customLogging = getCustomLogging(customLogginPath);
        String timeInMs = systemUtils.getDateTime(AppConstant.DateTimeFormat);
        if (timeInMs == null) {
            timeInMs = systemUtils.getTimeInMs();
        }
        if (customLogging != null) {
            String oldFilePath = customLogging.getDirectory() +
                    customLogging.getFileName() + customLogging.getFileExt();
            String newFilePath = customLogging.getDirectory() +
                    customLogging.getFileName() + "-" + timeInMs + customLogging.getFileExt();
            Boolean copyFileStatus = true;
            Boolean deleteFileContentStatus = true;
            if (systemUtils.isFileExist(oldFilePath)) {
                copyFileStatus = systemUtils.copyFile(oldFilePath, newFilePath);
                deleteFileContentStatus = systemUtils.deleteFileContent(oldFilePath);
            } else {
                SystemUtils.printLog("Old log file does not exist: source(dir/filename.ext)=" + oldFilePath);
            }
            if (!copyFileStatus) {
                SystemUtils.printLog("Error in copying file: source=" +
                        oldFilePath + " to destination:" + newFilePath);
            }
            if (!deleteFileContentStatus) {
                SystemUtils.printLog("Error in deleting file content: source=" + oldFilePath);
            }
        } else {
            SystemUtils.printLog("customLogging parameters are null");
        }
    }
}
