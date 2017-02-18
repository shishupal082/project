package com.todo.file.domain;

import java.util.ArrayList;

/**
 * Created by shishupalkumar on 18/02/17.
 */
public class ScanResult {
    private String pathName;
    private PathType pathType;
    private String staticFolderPath;
    private ArrayList<ScanResult> scanResults;
    public ScanResult(String staticFolderPath, String pathName){
        this.staticFolderPath = staticFolderPath;
        this.pathName = pathName;
    }
    public ScanResult(String staticFolderPath, String pathName, PathType pathType) {
        this.staticFolderPath = staticFolderPath;
        this.pathName = pathName;
        this.pathType = pathType;
    }

    public String getPathName() {
        return pathName;
    }

    public void setPathName(String pathName) {
        this.pathName = pathName;
    }

    public PathType getPathType() {
        return pathType;
    }

    public void setPathType(PathType pathType) {
        this.pathType = pathType;
    }

    public ArrayList<ScanResult> getScanResults() {
        return scanResults;
    }

    public void setScanResults(ArrayList<ScanResult> scanResults) {
        this.scanResults = scanResults;
    }

    public String getStaticFolderPath() {
        return staticFolderPath;
    }

    public void setStaticFolderPath(String staticFolderPath) {
        this.staticFolderPath = staticFolderPath;
    }

    @Override
    public String toString() {
        return "ScanResult{" +
            "pathName='" + pathName + '\'' +
            ", pathType=" + pathType +
            ", staticFolderPath='" + staticFolderPath + '\'' +
            ", scanResults=" + scanResults +
            '}';
    }
}
