package com.project.ftp.config;

/*
* Subset of DropWizard App Configuration file
* Generated after modification of parameter of config file
*/

import com.project.ftp.FtpConfiguration;
import com.project.ftp.session.SessionData;

import java.util.HashMap;

public class AppConfig {
    private String publicDir;
    final String appVersion = AppConstant.AppVersion;
    private HashMap<String, SessionData> sessionData;
    private FtpConfiguration ftpConfiguration;

    public String getPublicDir() {
        return publicDir;
    }

    public void setPublicDir(String publicDir) {
        this.publicDir = publicDir;
    }

    public HashMap<String, SessionData> getSessionData() {
        return sessionData;
    }

    public void setSessionData(HashMap<String, SessionData> sessionData) {
        this.sessionData = sessionData;
    }

    public FtpConfiguration getFtpConfiguration() {
        return ftpConfiguration;
    }

    public void setFtpConfiguration(FtpConfiguration ftpConfiguration) {
        this.ftpConfiguration = ftpConfiguration;
    }

    @Override
    public String toString() {
        return "AppConfig{" +
                "publicDir='" + publicDir + '\'' +
                ", appVersion='" + appVersion + '\'' +
                ", sessionData=" + sessionData +
                ", ftpConfiguration=" + ftpConfiguration +
                '}';
    }
}
