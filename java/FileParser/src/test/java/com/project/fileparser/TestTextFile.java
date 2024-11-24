package com.project.fileparser;

import com.project.fileparser.parser.TextFileParser;
import org.junit.Assert;
import org.junit.Test;

import java.util.ArrayList;

public class TestTextFile {
    @Test
    public void testTextFile() {
        //null
        String filepath = null;
        TextFileParser textFileParser = new TextFileParser(filepath);
        ArrayList<String> fileData = textFileParser.readTextFile();
        Assert.assertNull(fileData);
        //invalid file path
        filepath = "invalid-file-path";
        textFileParser = new TextFileParser(filepath);
        fileData = textFileParser.readTextFile();
        Assert.assertNull(fileData);
        //invalid file type (It will read as text file with garbage data)
        filepath = "D:/workspace/project/java/FileParser/meta-data/test-data/excel-file-3.xlsx";
        textFileParser = new TextFileParser(filepath);
        fileData = textFileParser.readTextFile();
        Assert.assertNotNull(fileData);
        //valid file path
        filepath = "D:/workspace/project/java/FileParser/meta-data/test-data/text-file-1.txt";
        textFileParser = new TextFileParser(filepath);
        fileData = textFileParser.readTextFile();
        Assert.assertEquals(5, fileData.size());
    }
    @Test
    public void testCsvFile() {
        String filepath = "D:/workspace/project/java/FileParser/meta-data/test-data/text-file-2.csv";
        TextFileParser textFileParser = new TextFileParser(filepath);
        ArrayList<ArrayList<String>> fileData = textFileParser.readCsvData();
        Assert.assertEquals(2, fileData.size());
        Assert.assertEquals("text-file-2.csv", fileData.get(0).get(1));
        Assert.assertEquals("csv", fileData.get(0).get(3));
    }
}
