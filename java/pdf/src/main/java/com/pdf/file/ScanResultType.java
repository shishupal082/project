package com.pdf.file;

/**
 * Created by shishupalkumar on 18/02/17.
 */
public enum ScanResultType {
    FILE("file"),
    FOLDER("folder");

    private String pathType;

    ScanResultType(String pathType) {
        this.pathType = pathType;
    }

    public String getPathType() {
        return pathType;
    }

    public void setPathType(String pathType) {
        this.pathType = pathType;
    }
}
