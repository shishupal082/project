package com.project.ftp;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.project.ftp.session.SessionData;
import io.dropwizard.Configuration;

import java.util.ArrayList;

@JsonIgnoreProperties(ignoreUnknown = true)

public class FtpConfiguration extends Configuration {
    private String indexPageReRoute;
    private String icoFilePath;
    private String publicDir;
    private String publicPostDir;
    private Integer maxFileSize;
    private String fileSaveDir;
    private ArrayList<String> adminUserNames;
    private ArrayList<String> supportedFileType;

    public String getIndexPageReRoute() {
        return indexPageReRoute;
    }

    public void setIndexPageReRoute(String indexPageReRoute) {
        this.indexPageReRoute = indexPageReRoute;
    }

    public String getIcoFilePath() {
        return icoFilePath;
    }

    public void setIcoFilePath(String icoFilePath) {
        this.icoFilePath = icoFilePath;
    }

    public String getPublicDir() {
        return publicDir;
    }

    public void setPublicDir(String publicDir) {
        this.publicDir = publicDir;
    }

    public String getPublicPostDir() {
        return publicPostDir;
    }

    public void setPublicPostDir(String publicPostDir) {
        this.publicPostDir = publicPostDir;
    }

    public Integer getMaxFileSize() {
        return maxFileSize;
    }

    public void setMaxFileSize(Integer maxFileSize) {
        this.maxFileSize = maxFileSize;
    }

    public String getFileSaveDir() {
        return fileSaveDir;
    }

    public void setFileSaveDir(String fileSaveDir) {
        this.fileSaveDir = fileSaveDir;
    }

    public ArrayList<String> getAdminUserNames() {
        return adminUserNames;
    }

    public void setAdminUserNames(ArrayList<String> adminUserNames) {
        this.adminUserNames = adminUserNames;
    }

    public ArrayList<String> getSupportedFileType() {
        return supportedFileType;
    }

    public void setSupportedFileType(ArrayList<String> supportedFileType) {
        this.supportedFileType = supportedFileType;
    }

    @Override
    public String toString() {
        return "FtpConfiguration{" +
                "indexPageReRoute='" + indexPageReRoute + '\'' +
                ", icoFilePath='" + icoFilePath + '\'' +
                ", publicDir='" + publicDir + '\'' +
                ", publicPostDir='" + publicPostDir + '\'' +
                ", maxFileSize=" + maxFileSize +
                ", fileSaveDir='" + fileSaveDir + '\'' +
                ", adminUserNames=" + adminUserNames +
                ", supportedFileType=" + supportedFileType +
                '}';
    }
}
