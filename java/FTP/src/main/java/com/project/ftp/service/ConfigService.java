package com.project.ftp.service;

import com.project.ftp.common.SysUtils;
import com.project.ftp.config.AppConfig;
import com.project.ftp.config.AppConstant;
import com.project.ftp.obj.PathInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ConfigService {
    final static Logger logger = LoggerFactory.getLogger(ConfigService.class);
    final AppConfig appConfig;
    final SysUtils sysUtils = new SysUtils();
    public ConfigService(final AppConfig appConfig) {
        this.appConfig = appConfig;
    }
    public void setPublicDir() {
        String systemDir = sysUtils.getProjectWorkingDir();
        String orgPublicDir = appConfig.getFtpConfiguration().getPublicDir();
        String publicPostDir = appConfig.getFtpConfiguration().getPublicPostDir();
        String publicDir = orgPublicDir;
        systemDir = StaticService.replaceBackSlashToSlash(systemDir);
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
        setPublicDir = StaticService.replaceLast("/", "", setPublicDir);
        logger.info("Calculated PublicDir: {}", setPublicDir);
        if (orgPublicDir != null) {
            appConfig.setPublicDir(setPublicDir);
        } else {
            logger.info("appConfig publicDir set skip.");
        }
        String fileSaveDir = appConfig.getFtpConfiguration().getFileSaveDir();
        PathInfo pathInfo = StaticService.getPathInfo(fileSaveDir);
        if (!AppConstant.FOLDER.equals(pathInfo.getType())) {
            logger.info("File save directory is not a folder: {}, setting as publicDir + /saved-files/", fileSaveDir);
            appConfig.getFtpConfiguration().setFileSaveDir(setPublicDir + "/saved-files/");
        } else {
            logger.info("File save directory is a folder: {}", fileSaveDir);
        }
    }
}
