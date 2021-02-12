package com.project.communication.parser;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppConstant;

import java.io.*;
import java.util.ArrayList;
import java.util.Arrays;

public class TextFileParser {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(TextFileParser.class);
    private final String filepath;
    private final boolean isNewFile;
    private final boolean isLogger;
    public TextFileParser(final String filepath) {
        this.filepath = filepath;
        this.isNewFile = false;
        this.isLogger = false;
    }
    public TextFileParser(final String filepath, final boolean isNewFile, final boolean isLogger) {
        this.filepath = filepath;
        this.isNewFile = isNewFile;
        this.isLogger = isLogger;
    }
    public ArrayList<String> getTextDataByLine() {
        ArrayList<String> result = new ArrayList<>();
        try {
            File file = new File(filepath);
            BufferedReader in = new BufferedReader(
                    new InputStreamReader(
                            new FileInputStream(file), AppConstant.UTF_8));
            String str;
            while ((str = in.readLine()) != null) {
                result.add(str);
            }
            in.close();
            logger.info("Text file read success: {}", filepath);
        } catch (Exception e) {
            logger.info("Error in reading text file: {}", e.getMessage());
        }
        return result;
    }
    public ArrayList<ArrayList<String>> getTextData() {
        ArrayList<ArrayList<String>> result = new ArrayList<>();
        try {
            File file = new File(filepath);
            BufferedReader in = new BufferedReader(
                    new InputStreamReader(
                            new FileInputStream(file), AppConstant.UTF_8));
            String str;
            String[] tempArr;
            ArrayList<String> temp;
            while ((str = in.readLine()) != null) {
                tempArr = str.split(",");
                temp = new ArrayList<>(Arrays.asList(tempArr));
                result.add(temp);
            }
            in.close();
            logger.info("Text file read success: {}", filepath);
        } catch (Exception e) {
            logger.info("Error in reading text file: {}", e.getMessage());
        }
        return result;
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
            if (!isLogger) {
                logger.info("Text added in: {}", filepath);
            }
            textAddStatus = true;
        } catch (Exception e) {
            logger.info("Error in adding text in filename: {}", filepath);
        }
        return textAddStatus;
    }
}
