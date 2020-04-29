package com.webapp.service;

import com.webapp.common.StrUtils;
import com.webapp.common.SysUtils;
import com.webapp.config.WebAppConfig;

public class ConfigService {
    private WebAppConfig webAppConfig;
    private SysUtils sysUtils = new SysUtils();
    public ConfigService(final WebAppConfig webAppConfig) {
        this.webAppConfig = webAppConfig;
    }
    private void setPublicDir() {
        String publicDir = webAppConfig.getWebAppConfiguration().getPublicDir();
        String systemDir = sysUtils.getProjectWorkingDir();
        if (publicDir == null) {
            publicDir = "";
        }
        if (systemDir == null) {
            systemDir = "";
        }
        String[] publicDirArr = publicDir.split("/");
        String[] systemDirArr = systemDir.split("/");
        int j = systemDirArr.length-1;
        for (int i=publicDirArr.length-1; i>=0; i--) {
            if (j>=0 && publicDirArr[i].equals("..")) {
                systemDirArr[j] = "";
                j--;
            }
        }
        String setPublicDir = "";
        for (int i=0; i<systemDirArr.length; i++) {
            if (!systemDirArr[i].equals("") || i==0) {
                setPublicDir += systemDirArr[i] + "/";
            }
        }
        String publicPostDir = webAppConfig.getWebAppConfiguration().getPublicPostDir();
        if (publicPostDir != null) {
            setPublicDir += publicPostDir;
        }
        setPublicDir = StrUtils.replaceLast("/", "", setPublicDir);
        webAppConfig.getAppConfig().setPublicDir(setPublicDir);
    }
    public static void init(final WebAppConfig webAppConfig) {
        ConfigService configService = new ConfigService(webAppConfig);
        configService.setPublicDir();
    }
}
