package com.project.fileparser;

import com.project.fileparser.parser.MSExcelSheetParser;
import com.project.fileparser.parser.TextFileParser;
import org.apache.log4j.Logger;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Scanner;

public class FileParserApplication {
    static Logger logger = Logger.getLogger(FileParserApplication.class);
    public static void checkTextFile(ArrayList<String> configRowData) {
        if (configRowData == null || configRowData.isEmpty()) {
            return;
        }
        if (configRowData.size() < 3) {
            return;
        }
        String filepath = configRowData.get(2);
        TextFileParser textFileParser = new TextFileParser(filepath);
        String fileData = textFileParser.getTextDataV2();
        logger.info(fileData);
    }
    public static void checkCsvData(ArrayList<String> configRowData) {
        if (configRowData == null || configRowData.isEmpty()) {
            return;
        }
        if (configRowData.size() < 3) {
            return;
        }
        String filepath = configRowData.get(2);
        TextFileParser textFileParser = new TextFileParser(filepath);
        ArrayList<ArrayList<String>> fileData = textFileParser.readCsvData();
        for (ArrayList<String> rowData: fileData) {
            logger.info(rowData);
        }
    }
    public static void checkExcelData(ArrayList<String> configRowData) {
        if (configRowData == null || configRowData.isEmpty()) {
            return;
        }
        if (configRowData.size() < 4) {
            logger.info("For excel file, minimum 4 parameter required: " + configRowData);
            return;
        }
        String filepath = configRowData.get(2);
        String sheetName = configRowData.get(3);
        MSExcelSheetParser msExcelSheetParser = new MSExcelSheetParser();
        ArrayList<ArrayList<String>> fileData = msExcelSheetParser.readExcelSheetData(filepath, sheetName);
        for (ArrayList<String> rowData: fileData) {
            logger.info(rowData);
        }
    }
    public static void run(ArrayList<String> arguments) {
        String configPath, id;
        if (arguments == null || arguments.isEmpty()) {
            logger.info("Argument parameter missing");
            return;
        } else if (arguments.size() < 2) {
            logger.info("Minimum 2 argument parameter required");
            return;
        }
        configPath = arguments.getFirst();
        id = arguments.get(1);
        if (configPath == null || configPath.isEmpty() || id == null || id.isEmpty()) {
            logger.info("Invalid configPath or configId: " + configPath + ", " + id);
            return;
        }
        TextFileParser textFileParser = new TextFileParser(configPath);
        ArrayList<ArrayList<String>> configData = textFileParser.readCsvData();
        if (configData == null || configData.isEmpty()) {
            logger.info("Invalid configData: " + arguments);
            return;
        }
        String firstIndexData;
        ArrayList<String> configRowData = null;
        for(ArrayList<String> rowData: configData) {
            if (rowData == null || rowData.isEmpty()) {
                continue;
            }
            firstIndexData = rowData.getFirst();
            if (id.equals(firstIndexData)) {
                configRowData = rowData;
                break;
            }
        }
        if (configRowData == null) {
            logger.info("configRowData not found for args: " + arguments);
            return;
        }
        logger.info("Config row data: " + configRowData);
        if (configRowData.size() < 2) {
            logger.info("Invalid configRowData: " + configRowData);
            return;
        }
        String dataType = configRowData.get(1);
        if ("text".equals(dataType)) {
            checkTextFile(configRowData);
        } else if ("csv".equals(dataType)) {
            checkCsvData(configRowData);
        } else if ("excel".equals(dataType)) {
            checkExcelData(configRowData);
        } else {
            logger.info("Invalid dataType in configData: " + configRowData);
        }
    }
    public static void main(String[] args) {
        ArrayList<String> arguments = new ArrayList<>(Arrays.asList(args));
        run(arguments);
        Scanner myObj = new Scanner(System.in);
        logger.info("Press any key to exit.");
        myObj.nextLine();
    }
}
