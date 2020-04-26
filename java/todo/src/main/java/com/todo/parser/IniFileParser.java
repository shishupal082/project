package com.todo.parser;

import com.todo.TodoConfiguration;
import com.todo.constants.AppConstant;
import org.ini4j.Ini;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

public class IniFileParser {
    private static Logger logger = LoggerFactory.getLogger(IniFileParser.class);
    private String filename;
    public IniFileParser(final TodoConfiguration todoConfiguration) {
        filename = todoConfiguration.getIniFilePath();
    }
    public Object parseIni() {
        Map<String, String> response = new HashMap<String, String>();
        if (filename == null) {
            response.put(AppConstant.STATUS, AppConstant.FAILURE);
            response.put(AppConstant.FILENAME, null);
            response.put(AppConstant.REASON, AppConstant.FILENAME + " is null.");
            return response;
        }
        try {
            Ini ini = new Ini(new File(filename));
            logger.info("IniFileParsing success: data={}", ini.toString());
            return ini;
        } catch (Exception e) {
            response.put(AppConstant.STATUS, AppConstant.FAILURE);
            response.put(AppConstant.FILENAME, filename);
            response.put(AppConstant.REASON, e.getMessage());
            logger.info("Error in iniFileParsing: filename={}, {}", filename, e.getMessage());
        }
        return response;
    }
}
