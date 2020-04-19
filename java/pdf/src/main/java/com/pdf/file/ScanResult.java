package com.pdf.file;

import java.util.ArrayList;

/**
 * Created by shishupalkumar on 18/02/17.
 */
public class ScanResult {
    private String name;
    private String path;
    private ScanResultType resultType;
    private ArrayList<ScanResult> scanResults;
    public ScanResult(ScanResultType resultType){
        this.resultType = resultType;
    }
    public ScanResult(String path){
        this.path = path;
    }
    public ScanResult(String name, ScanResultType resultType){
        this.name = name;
        this.resultType = resultType;
    }
    public ScanResult(String path, String name, ScanResultType resultType){
        this.path = path;
        this.name = name;
        this.resultType = resultType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ScanResultType getResultType() {
        return resultType;
    }

    public void setResultType(ScanResultType resultType) {
        this.resultType = resultType;
    }

    public ArrayList<ScanResult> getScanResults() {
        return scanResults;
    }

    public void setScanResults(ArrayList<ScanResult> scanResults) {
        this.scanResults = scanResults;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    @Override
    public String toString() {
        return "ScanResult{" +
            "name='" + name + '\'' +
            ", path='" + path + '\'' +
            ", resultType=" + resultType +
            ", scanResults=" + scanResults +
            '}';
    }
}
