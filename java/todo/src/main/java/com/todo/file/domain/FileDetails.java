package com.todo.file.domain;

import java.io.File;

/**
 * Created by shishupalkumar on 19/02/17.
 */
public class FileDetails {
    private File file;
    private String fileName;
    private String filePath;
    private String fileExtention;
    private String fileMemType;

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getFileExtention() {
        return fileExtention;
    }

    public void setFileExtention(String fileExtention) {
        this.fileExtention = fileExtention;
    }

    public String getFileMemType() {
        return fileMemType;
    }

    public void setFileMemType(String fileMemType) {
        this.fileMemType = fileMemType;
    }

    public File getFile() {
        return file;
    }

    public void setFile(File file) {
        this.file = file;
    }

    @Override
    public String toString() {
        return "FileDetails{" +
            "file=" + file +
            ", fileName='" + fileName + '\'' +
            ", filePath='" + filePath + '\'' +
            ", fileExtention='" + fileExtention + '\'' +
            ", fileMemType='" + fileMemType + '\'' +
            '}';
    }
}
