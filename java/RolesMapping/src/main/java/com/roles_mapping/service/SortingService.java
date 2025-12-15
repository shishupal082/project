package com.roles_mapping.service;

import com.roles_mapping.config.BridgeConstant;
import com.roles_mapping.sorting.SortingData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Comparator;

public class SortingService {
    private final static Logger logger = LoggerFactory.getLogger(SortingService.class);
    public SortingService() {}
    private Integer parseInt(String intString, Integer defaultValue) {
        int result;
        if (intString == null) {
            return defaultValue;
        }
        try {
            result = Integer.parseInt(intString);
            return result;
        } catch (Exception ignored) {
        }
        return defaultValue;
    }
    public ArrayList<ArrayList<String>> sortExcelData(ArrayList<ArrayList<String>> excelData, Integer index,
                                                      ArrayList<Integer> skipRowIndex, String order, String dataType, String defaultData) {
        if (excelData == null || excelData.isEmpty()) {
            return excelData;
        }
        if (index == null || index < 0) {
            return excelData;
        }
        if (!BridgeConstant.DESC.equals(order)) {
            order = BridgeConstant.ASC;
        }
        boolean isDataTypeNum = BridgeConstant.INT.equals(dataType);
        if (!isDataTypeNum) {
            dataType = BridgeConstant.STRING;
            if (defaultData == null) {
                defaultData = BridgeConstant.EMPTY;
            }
        }
        int defaultNum = 0;
        Integer parseIntData;
        if (BridgeConstant.INT.equals(dataType)) {
            parseIntData = this.parseInt(defaultData, null);
            if (parseIntData != null) {
                defaultNum = parseIntData;
            } else {
                logger.info("dataType is INT and defaultData is not a number: {}", defaultData);
            }
        }
        ArrayList<SortingData> sortingData = new ArrayList<>();
        SortingData sortingData1;
        int i;
        int size = excelData.size();
        String cellData;
        int cellDataNum;
        ArrayList<String> rowData;
        ArrayList<Integer> finalSkipRowIndex = new ArrayList<>();
        ArrayList<ArrayList<String>> skippedData = new ArrayList<>();
        if (skipRowIndex != null) {
            for(Integer i2: skipRowIndex) {
                if (i2 != null && i2 >= 0) {
                    finalSkipRowIndex.add(i2);
                    if (i2 < size) {
                        skippedData.add(excelData.get(i2));
                    }
                }
            }
        }
        for (i=0;i<size;i++) {
            if (finalSkipRowIndex.contains(i)) {
                continue;
            }
            rowData = excelData.get(i);
            if (rowData == null) {
                continue;
            }
            if (index < rowData.size()) {
                cellData = rowData.get(index);
            } else {
                cellData = null;
            }
            if (isDataTypeNum) {
                cellDataNum = this.parseInt(cellData,defaultNum);
                sortingData1 = new SortingData(i,cellDataNum);
            } else {
                if (cellData == null) {
                    cellData = defaultData;
                }
                sortingData1 = new SortingData(i,cellData);
            }
            sortingData.add(sortingData1);
        }
        if (isDataTypeNum) {
            if (BridgeConstant.DESC.equals(order)) {
                sortingData.sort(Comparator.comparing(SortingData::getRowDataInt).reversed());
            } else {
                sortingData.sort(Comparator.comparing(SortingData::getRowDataInt));
            }
        } else {
            if (BridgeConstant.DESC.equals(order)) {
                sortingData.sort(Comparator.comparing(SortingData::getRowDataStr).reversed());
            } else {
                sortingData.sort(Comparator.comparing(SortingData::getRowDataStr));
            }
        }
        ArrayList<ArrayList<String>> result = new ArrayList<>();
        for(ArrayList<String> row: skippedData) {
            if (row != null) {
                result.add(row);
            }
        }
        for(SortingData sortingData2: sortingData) {
            result.add(excelData.get(sortingData2.getRowIndex()));
        }
        return result;
    }
}
