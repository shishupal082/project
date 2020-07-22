package com.project.ftp.parser;

import com.project.ftp.config.AppConfig;
import com.project.ftp.config.AppConstant;
import com.project.ftp.exceptions.AppException;
import com.project.ftp.exceptions.ErrorCodes;
import com.project.ftp.obj.PathInfo;
import com.project.ftp.service.StaticService;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileReader;

public class JsonFileParser {
    final static Logger logger = LoggerFactory.getLogger(JsonFileParser.class);
    final AppConfig appConfig;
    public JsonFileParser(final AppConfig appConfig) {
        this.appConfig = appConfig;
    }
    public Object getJsonObject() throws AppException {
        Object object = null;
        String filepath = appConfig.getFtpConfiguration().getFileSaveDir();
        filepath += AppConstant.APP_STATIC_DATA_FILENAME;
        PathInfo pathInfo = StaticService.getPathInfo(filepath);
        if (!AppConstant.FILE.equals(pathInfo.getType())) {
            logger.info("Requested file is not found: {}", filepath);
            throw new AppException(ErrorCodes.FILE_NOT_FOUND);
        }
        try {
            JSONParser jsonParser = new JSONParser();
            FileReader fileReader = new FileReader(filepath);
            object = jsonParser.parse(fileReader);
            logger.info("Json file data success: {}", filepath);
        } catch (Exception e) {
            logger.info("Error in reading json file: {}", e.getMessage());
            throw new AppException(ErrorCodes.INVALID_FILE_DATA);
        }
        return object;
    }
}
