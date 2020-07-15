package com.webapp.service;

import com.webapp.common.StrUtils;
import com.webapp.common.SysUtils;
import com.webapp.config.WebAppConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ConfigService {
    final static Logger logger = LoggerFactory.getLogger(ConfigService.class);
    final WebAppConfig webAppConfig;
    final SysUtils sysUtils = new SysUtils();
    public ConfigService(final WebAppConfig webAppConfig) {
        this.webAppConfig = webAppConfig;
    }
    private void setPublicDir() {
        String publicDir = webAppConfig.getWebAppConfiguration().getPublicDir();
        String systemDir = sysUtils.getProjectWorkingDir();
        String publicPostDir = webAppConfig.getWebAppConfiguration().getPublicPostDir();

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
        webAppConfig.getAppConfig().setPublicDir(setPublicDir);
    }
    public static void init(final WebAppConfig webAppConfig) {
        ConfigService configService = new ConfigService(webAppConfig);
        configService.setPublicDir();
    }
}
