package com.webapp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.webapp.config.DirectoryConfig;
import io.dropwizard.Configuration;

import java.util.ArrayList;

@JsonIgnoreProperties(ignoreUnknown = true)
public class WebAppConfiguration extends Configuration {
    private String indexPageReRoute;
    private String icoFilePath;
    private String publicDir;
    private String publicPostDir;
    private ArrayList<String> allowedOrigin;
    private DirectoryConfig directoryConfig;

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

    public ArrayList<String> getAllowedOrigin() {
        return allowedOrigin;
    }

    public void setAllowedOrigin(ArrayList<String> allowedOrigin) {
        this.allowedOrigin = allowedOrigin;
    }

    public DirectoryConfig getDirectoryConfig() {
        return directoryConfig;
    }

    public void setDirectoryConfig(DirectoryConfig directoryConfig) {
        this.directoryConfig = directoryConfig;
    }

    @Override
    public String toString() {
        return "WebAppConfiguration{" +
                "indexPageReRoute='" + indexPageReRoute + '\'' +
                ", icoFilePath='" + icoFilePath + '\'' +
                ", publicDir='" + publicDir + '\'' +
                ", publicPostDir='" + publicPostDir + '\'' +
                ", allowedOrigin=" + allowedOrigin +
                ", directoryConfig=" + directoryConfig +
                '}';
    }
}
