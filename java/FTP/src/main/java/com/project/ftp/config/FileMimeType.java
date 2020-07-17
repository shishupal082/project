package com.project.ftp.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public enum FileMimeType {
    pdf("application/pdf"),
    json("application/json"),
    png("image/png"),
    jpg("image/jpg"),
    jpeg("image/jpeg"),
    gif("image/gif"),
    ico("image/x-icon"),
    css("text/css"),
    js("text/javascript"),
    html("text/html"),
    yaml("text/plain"),
    yml("text/plain"),
    csv("text/plain"),
    txt("text/plain"),
    bat("text/plain"),
    sh("text/sh");

    /*Not supported by browser
        - doc, docx, xls, xlsx, ppt, pptx
        - zar, exe, mp3, mp4, mov
    */

    final static Logger logger = LoggerFactory.getLogger(FileMimeType.class);

    private String fileMimeType;
    FileMimeType(String fileMimeType) {
        this.fileMimeType = fileMimeType;
    }

    public String getFileMimeType() {
        return fileMimeType;
    }

    public void setFileMimeType(String fileMimeType) {
        this.fileMimeType = fileMimeType;
    }
    public static String getValue(String name) {
        String response = null;
        FileMimeType fileMimeType;
        try {
            fileMimeType = FileMimeType.valueOf(name);
            response = fileMimeType.getFileMimeType();
        } catch (Exception e) {
//            logger.info("Error in parsing enum ({}): {}", name, e.getMessage());
        }
        return response;
    }
}
