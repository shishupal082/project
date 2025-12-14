package com.roles_mapping.sorting;

public class SortingData {
    private final int rowIndex;
    private int rowDataInt;
    private String rowDataStr;
    public SortingData(int rowIndex, int rowDataInt) {
        this.rowIndex = rowIndex;
        this.rowDataInt = rowDataInt;
    }
    public SortingData(int rowIndex, String rowDataStr) {
        this.rowIndex = rowIndex;
        this.rowDataStr = rowDataStr;
    }

    public int getRowIndex() {
        return rowIndex;
    }

    public int getRowDataInt() {
        return rowDataInt;
    }

    public String getRowDataStr() {
        return rowDataStr;
    }
}
