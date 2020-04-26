package com.todo.parser;

import com.todo.TodoConfiguration;
import com.todo.common.TodoException;
import com.todo.constants.AppConstant;
import com.todo.utils.ErrorCodes;
import com.todo.utils.StringUtils;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;

public class JsonFileParser {
    private static Logger logger = LoggerFactory.getLogger(JsonFileParser.class);
    private TodoConfiguration todoConfiguration;
    public JsonFileParser(final TodoConfiguration todoConfiguration) {
        this.todoConfiguration = todoConfiguration;
    }
    public Object getJsonFileResponse (final String jsonFileRef) throws TodoException {
        Object obj = null;
        String fileName = null;
        JSONParser jsonParser = new JSONParser();
        if (jsonFileRef == null) {
            logger.info("Invalid request jsonFileRef : null");
            throw new TodoException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        try {
            HashMap<String, String> jsonFileMapping = todoConfiguration.getConfigInterface()
                    .getAppConfig().getJsonFileMapping();
            if (jsonFileMapping == null) {
                logger.info("Invalid config jsonFileMapping : null");
            } else {
                fileName = jsonFileMapping.get(jsonFileRef);
                if (fileName == null) {
                    logger.info("Invalid request jsonFileRef: {}, in jsonFileMapping: {}",
                            jsonFileRef, jsonFileMapping);
                } else {
                    FileReader reader = new FileReader(fileName);
                    obj = jsonParser.parse(reader);
                    logger.info("Read json file {} for jsonFileRef {} is success",
                            fileName, jsonFileRef);
                }
            }
        } catch (FileNotFoundException e) {
            logger.info("File not found : {}, {}, {}", StringUtils.getLoggerObject(jsonFileRef, fileName, e));
        } catch (IOException e) {
            logger.info("IOExcpection for file : {}, {}, {}", StringUtils.getLoggerObject(jsonFileRef, fileName, e));
        } catch (ParseException e) {
            logger.info("ParseException for file : {}, {}, {}", StringUtils.getLoggerObject(jsonFileRef, fileName, e));
        } catch (Exception e) {
            logger.info("Unknown exception for jsonFileRef : {}, {}", jsonFileRef, e);
        }
        if (obj == null) {
            HashMap<String, String> objV2 = new HashMap<String, String>();
            objV2.put(AppConstant.STATUS, AppConstant.FAILURE);
            obj = objV2;
        }
        return obj;
    }
}
