package com.project.communication.parser;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppConstant;

import java.io.*;

public class TextFileParser {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(TextFileParser.class);
    private final String filepath;
    private final boolean isNewFile;
    public TextFileParser(final String filepath) {
        this.filepath = filepath;
        this.isNewFile = false;
    }
    public TextFileParser(final String filepath, final boolean isNewFile) {
        this.filepath = filepath;
        this.isNewFile = isNewFile;
    }
    public boolean addText(String text) {
        if (text == null) {
            text = "";
        }
        boolean textAddStatus = false;
        File file = new File(filepath);
        if (!file.isFile()) {
            logger.info("Requested file is not found: {}", filepath);
            return false;
        }
        try {
            Writer writer = new BufferedWriter(new OutputStreamWriter(
                    new FileOutputStream(file, true), AppConstant.UTF_8));
            if (!isNewFile) {
                writer.append("\n");
            }
            writer.append(text);
            writer.close();
            logger.info("Text added in: {}", filepath);
            textAddStatus = true;
        } catch (Exception e) {
            logger.info("Error in adding text in filename: {}", filepath);
        }
        return textAddStatus;
    }
}
