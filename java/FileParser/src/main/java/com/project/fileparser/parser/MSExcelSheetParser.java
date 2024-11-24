package com.project.fileparser.parser;

import org.apache.log4j.Logger;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.File;
import java.io.FileInputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;

public class MSExcelSheetParser {
    final static Logger logger = Logger.getLogger(MSExcelSheetParser.class);
    private FormulaEvaluator evaluator;
    private String dateFormat;
    private String timeFormat;
    private String dateTimeFormat;
    public MSExcelSheetParser() {
        evaluator = null;
    }
    public MSExcelSheetParser(String dateFormat, String timeFormat, String dateTimeFormat) {
        evaluator = null;
        this.dateFormat = dateFormat;
        this.timeFormat = timeFormat;
        this.dateTimeFormat = dateTimeFormat;
    }
    private String getDateFormat() {
        if (dateFormat == null || dateFormat.isEmpty()) {
            return "yyyy-MM-dd";
        }
        return dateFormat;
    }

    private String getTimeFormat() {
        if (timeFormat == null || timeFormat.isEmpty()) {
            return "HH:mm:ss";
        }
        return timeFormat;
    }

    private String getDateTimeFormat() {
        if (dateTimeFormat == null || dateTimeFormat.isEmpty()) {
            return "yyyy-MM-dd HH:mm:ss";
        }
        return dateTimeFormat;
    }

    private String getDateStrFromDateObj(String format, Date dateObj) {
        if (format == null || dateObj == null) {
            return "";
        }
        DateFormat dateFormat = new SimpleDateFormat(format);
        return dateFormat.format(dateObj);
    }
    private void insertData(ArrayList<ArrayList<String>> sheetData, int rowIndex, int colIndex, String cellData) {
        if (sheetData == null) {
            return;
        }
        if (sheetData.size() <= rowIndex) {
            for (int i=sheetData.size(); i<=rowIndex; i++) {
                sheetData.add(new ArrayList<>());
            }
        }
        ArrayList<String> rowData = sheetData.get(rowIndex);
        if (rowData == null) {
            return;
        }
        if (rowData.size() <= colIndex) {
            for (int i=rowData.size(); i<colIndex; i++) {
                rowData.add("");
            }
        }
        rowData.add(cellData);
        sheetData.set(rowIndex, rowData);
    }
    public ArrayList<ArrayList<String>> readExcelSheetData(String srcFilepath, String sheetName) {
        if (sheetName == null || srcFilepath == null) {
            logger.info("Invalid srcFilepath: {} or sheetName: {}, " + srcFilepath + ", " + sheetName);
            return null;
        }
        ArrayList<ArrayList<String>> sheetData = new ArrayList<>();
        Cell cell;
        String cellData;
        File file1 = new File(srcFilepath);
        FileInputStream file = null;
        if (!file1.isFile()) {
            logger.info("Source excel filepath: {} does not exist: " + srcFilepath);
            return null;
        }
        try {
            file = new FileInputStream(file1);
            XSSFWorkbook workbook = new XSSFWorkbook(file);
            evaluator = workbook.getCreationHelper().createFormulaEvaluator();
            XSSFSheet sheet = workbook.getSheet(sheetName);
            if (sheet == null) {
                file.close();
                logger.info("Sheet data is null for filepath, sheetName: " + srcFilepath + ", " + sheetName);
                return null;
            }
            for (Row row : sheet) {
                Iterator<Cell> cellIterator = row.cellIterator();
                while (cellIterator.hasNext()) {
                    cell = cellIterator.next();
                    cellData = this.parseCellData(cell);
                    this.insertData(sheetData, row.getRowNum(), cell.getColumnIndex(), cellData);
                }
            }
            file.close();
        } catch (Exception e) {
            logger.info("Error in reading excel filepath: {}, sheetName: {}, {}" + srcFilepath + "," + sheetName + "," + e.getMessage());
            return null;
        }
        return sheetData;
    }
    private String convertNumericCellToString(Cell cell) {
        String result = null;
        double numericCellData = cell.getNumericCellValue();
        if (DateUtil.isCellDateFormatted(cell)) {
            Date dateCellValue = cell.getDateCellValue();
            if (numericCellData < 1) {
                result = this.getDateStrFromDateObj(this.getTimeFormat(), dateCellValue);
            } else if (numericCellData % 1 == 0) {
                result = this.getDateStrFromDateObj(this.getDateFormat(), dateCellValue);
            } else {
                result = this.getDateStrFromDateObj(this.getDateTimeFormat(), dateCellValue);
            }
        } else {
            if (numericCellData % 1 == 0) {
                result = Integer.toString((int) numericCellData);
            } else {
                result = Double.toString(numericCellData);
            }
        }
        return result;
    }
    private String readCellData(CellType cellType, Cell cell) {
        String result = "";
        switch (cellType) {
            case NUMERIC:
                result = this.convertNumericCellToString(cell);
                break;
            case STRING:
                result = cell.getStringCellValue();
                break;
            case BOOLEAN:
                result = Boolean.toString(cell.getBooleanCellValue());
                break;
            case FORMULA:
                if (evaluator != null) {
                    switch (evaluator.evaluateFormulaCell(cell)) {
                        case BOOLEAN:
                            result = Boolean.toString(cell.getBooleanCellValue());
                            break;
                        case NUMERIC:
                            result = this.convertNumericCellToString(cell);
                            break;
                        case STRING:
                            result = cell.getStringCellValue();
                            break;
                    }
                }
                break;
            case ERROR:
            case BLANK:
            default: break;
        }
        return result;
    }
    private String parseCellData(Cell cell) {
        CellType cellType;
        String result = "";
        if (cell != null) {
            cellType = cell.getCellType();
            result = this.readCellData(cellType, cell);
        }
        return result;
    }
}
