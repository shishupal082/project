package com.project.ftp.parser;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.project.ftp.common.SysUtils;
import com.project.ftp.obj.LogFilePath;
import com.project.ftp.service.StaticService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;

public class YamlFileParser {
    final static Logger logger = LoggerFactory.getLogger(YamlFileParser.class);
    public YamlFileParser() {}
    public String getLogFilePath(String configFilePath) {
        if (configFilePath == null) {
            return null;
        }
        String logFilePath = null;
        LogFilePath logFileReading = null;
        ObjectMapper objectMapper = new ObjectMapper(new YAMLFactory());
        try {
            logFileReading = objectMapper.readValue(new File(configFilePath), LogFilePath.class);
            logFilePath = logFileReading.getLogFilePath();
        } catch (IOException ioe) {
            StaticService.printLog("IOE : for file : " + configFilePath);
        }
        return logFilePath;
    }
}
