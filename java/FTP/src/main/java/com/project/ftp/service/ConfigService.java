package com.project.ftp.service;

import com.project.ftp.common.StrUtils;
import com.project.ftp.common.SysUtils;
import com.project.ftp.config.AppConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ConfigService {
    final static Logger logger = LoggerFactory.getLogger(ConfigService.class);
    final AppConfig appConfig;
    final SysUtils sysUtils = new SysUtils();
    public ConfigService(final AppConfig appConfig) {
        this.appConfig = appConfig;
    }
    private void setPublicDir() {
        String systemDir = sysUtils.getProjectWorkingDir();
        String publicDir = appConfig.getFtpConfiguration().getPublicDir();
        String publicPostDir = appConfig.getFtpConfiguration().getPublicPostDir();

        logger.info("systemDir: {}", systemDir);
        logger.info("configPublicDir: {}", publicDir);
        logger.info("configPublicPostDir: {}", publicPostDir);
        if (publicDir == null) {
            publicDir = "";
        }
        if (systemDir == null) {
            systemDir = "";
        }
        String[] publicDirArr = publicDir.split("/");
        String[] systemDirArr = null;
        if (systemDir.contains("/")) {
            systemDirArr = systemDir.split("/");
        } else {
            // Fix for windows system
            systemDirArr = systemDir.split("\\\\");
        }
        int j = systemDirArr.length-1;
        for (int i=publicDirArr.length-1; i>=0; i--) {
            if (j>=0 && publicDirArr[i].equals("..")) {
                systemDirArr[j] = "";
                j--;
            }
        }
        String setPublicDir = "";
        for (int i=0; i<systemDirArr.length; i++) {
            if (!systemDirArr[i].equals("")) {
                setPublicDir += systemDirArr[i] + "/";
            }
        }
        if (publicPostDir != null) {
            setPublicDir += publicPostDir;
        }
        setPublicDir = StrUtils.replaceLast("/", "", setPublicDir);
        logger.info("Calculated PublicDir: {}", setPublicDir);
        appConfig.setPublicDir(setPublicDir);
    }
    public static void init(final AppConfig appConfig) {
        ConfigService configService = new ConfigService(appConfig);
        configService.setPublicDir();
    }
}
