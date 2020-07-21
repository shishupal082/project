package com.project.ftp.obj;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RequestDeleteFile {
    @JsonProperty("filename")
    private String filename;

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    @Override
    public String toString() {
        return "RequestDeleteFile{" +
                "filename='" + filename + '\'' +
                '}';
    }
}
