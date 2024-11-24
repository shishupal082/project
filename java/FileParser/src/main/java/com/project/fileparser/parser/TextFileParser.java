package com.project.fileparser.parser;

import org.apache.log4j.Logger;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;

public class TextFileParser {
    private final static Logger logger = Logger.getLogger(TextFileParser.class);
    private final String filepath;
    public TextFileParser(final String filepath) {
        this.filepath = filepath;
    }
    public ArrayList<ArrayList<String>> readCsvData() {
        ArrayList<String> fileData = this.readTextFile();
        if (fileData == null || fileData.isEmpty()) {
            return null;
        }
        ArrayList<ArrayList<String>> result = new ArrayList<>();
        ArrayList<String> lineData;
        String[] tempArr;
        for (String line: fileData) {
            tempArr = line.split(",");
            lineData = new ArrayList<>();
            for (String s : tempArr) {
                lineData.add(s.trim());
            }
            result.add(lineData);
        }
        return result;
    }
    public String getTextDataV2() {
        ArrayList<String> fileData = this.readTextFile();
        if (fileData == null || fileData.isEmpty()) {
            return "";
        }
        return String.join("\n", fileData);
    }
    public ArrayList<String> readTextFile() {
        ArrayList<String> response = new ArrayList<>();
        if (filepath == null || filepath.isEmpty()) {
            logger.info("Invalid requested file path: " + filepath);
            return null;
        }
        File file = new File(filepath);
        try {
            BufferedReader in = new BufferedReader(
                    new InputStreamReader(
                            new FileInputStream(file), StandardCharsets.UTF_8));
            String str;
            while ((str = in.readLine()) != null) {
                response.add(str);
            }
            in.close();
        } catch (FileNotFoundException e) {
            logger.info("FileNotFoundException, fileName: " + filepath + ", " + e.getMessage());
            response = null;
        } catch (Exception e) {
            logger.info("Unknown Exception, fileName: " + filepath + "," + e.getMessage());
            response = null;
        }
        return response;
    }
}
