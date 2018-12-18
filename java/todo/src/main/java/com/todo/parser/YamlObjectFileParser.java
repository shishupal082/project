package com.todo.parser;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.todo.utils.ErrorCodes;
import com.todo.utils.StringUtils;
import com.todo.utils.TodoException;
import com.todo.yaml.todo.YamlObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;

public class YamlObjectFileParser {
    private static Logger logger = LoggerFactory.getLogger(YamlObjectFileParser.class);
    public YamlObjectFileParser() {}
    public YamlObject getYamlObjectFromFile(String yamlObjectPath) {
        YamlObject yamlObject = null;
        ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
        try {
            yamlObject = mapper.readValue(new File(yamlObjectPath), YamlObject.class);
        } catch (IOException ioe) {
            logger.info("IOE : for file : {}", StringUtils.getLoggerObject(yamlObjectPath, ioe));
            throw new TodoException(ErrorCodes.RUNTIME_ERROR);
        }
        return yamlObject;
    }
}
