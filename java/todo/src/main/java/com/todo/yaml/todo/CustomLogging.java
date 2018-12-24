package com.todo.yaml.todo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CustomLogging {
    private String directory;
    private String fileName;
    private String fileExt;

    public String getDirectory() {
        return directory;
    }

    public void setDirectory(String directory) {
        this.directory = directory;
    }

    public String getFileName() {
        return fileName;
    }

    public String getFileExt() {
        return fileExt;
    }

    public void setFileExt(String fileExt) {
        this.fileExt = fileExt;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    @Override
    public String toString() {
        return "CustomLogging{" +
                "directory='" + directory + '\'' +
                ", fileName='" + fileName + '\'' +
                ", fileExt='" + fileExt + '\'' +
                '}';
    }
}
