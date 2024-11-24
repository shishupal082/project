package com.project.fileparser;

import com.project.fileparser.parser.MSExcelSheetParser;
import org.apache.log4j.Logger;
import org.junit.Assert;
import org.junit.Test;

import java.util.ArrayList;

public class TestExcelFile {
    private static Logger logger = Logger.getLogger(TestExcelFile.class);
    @Test
    public void testExcelFile() {
        //(1)
        String filepath;
        String sheetName;
        MSExcelSheetParser excelSheetParser = new MSExcelSheetParser();
        ArrayList<ArrayList<String>> fileData = excelSheetParser.readExcelSheetData(null, null);
        Assert.assertNull(fileData);
        //(2)
        sheetName = "data";
        fileData = excelSheetParser.readExcelSheetData(null, sheetName);
        Assert.assertNull(fileData);
        //(3)
        filepath = "invalid-src-filepath";
        fileData = excelSheetParser.readExcelSheetData(filepath, null);
        Assert.assertNull(fileData);
        //(4)
        filepath = "D:/workspace/project/java/FileParser/meta-data/test-data/excel-file-3.xlsx";
        fileData = excelSheetParser.readExcelSheetData(filepath, null);
        Assert.assertNull(fileData);
        //(5)
        filepath = "D:/workspace/project/java/FileParser/meta-data/test-data/excel-file-3.xlsx";
        sheetName = "invalid-sheet-name";
        fileData = excelSheetParser.readExcelSheetData(filepath, sheetName);
        Assert.assertNull(fileData);
        //(6)
        filepath = "D:/workspace/project/java/FileParser/meta-data/test-data/excel-file-3.xlsx";
        sheetName = "data";
        fileData = excelSheetParser.readExcelSheetData(filepath, sheetName);
        logger.info(fileData.get(0).toString());
        logger.info(fileData.get(1).toString());
        logger.info(fileData.get(2).toString());
        logger.info(fileData.get(3).toString());
        logger.info(fileData.get(4).toString());
        Assert.assertEquals(5, fileData.size());
    }
}
