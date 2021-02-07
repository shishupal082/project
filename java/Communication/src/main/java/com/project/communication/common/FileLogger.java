package com.project.communication.common;

import com.project.communication.parser.TextFileParser;

import java.io.File;

public class FileLogger {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(FileLogger.class);
    private final String filepath;
    private final TextFileParser textFileParser;
    public FileLogger(String filepath) {
        this.filepath = filepath;
        this.textFileParser = new TextFileParser(filepath, false, true);
        if (!this.isValid()) {
            logger.info("filepath: " + filepath + ", is not valid");
        }
    }
    private boolean isValid() {
        if (filepath == null) {
            return false;
        }
        File file = new File(filepath);
        return file.isFile();
    }
    public void addToFile(String logText) {
        if (this.isValid()) {
            textFileParser.addText(logText);
        }
    }
}
