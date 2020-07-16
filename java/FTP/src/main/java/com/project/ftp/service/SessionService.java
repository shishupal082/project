package com.project.ftp.service;

import com.project.ftp.config.AppConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;

public class SessionService {
    final static Logger logger = LoggerFactory.getLogger(FileService.class);
    final AppConfig appConfig;
    private HashMap<String, String> tempConfig;
    public SessionService(final AppConfig appConfig) {
        this.appConfig = appConfig;
        tempConfig = appConfig.getFtpConfiguration().getTempConfig();
    }
    public Boolean isLogin() {
        Boolean isLogin = false;
        if (tempConfig != null) {
            if ("true".equals(tempConfig.get("isLogin"))) {
                isLogin = true;
            }
        }
        return isLogin;
    }
    public String getLoginUserName() {
        String userName = "";
        if (!isLogin()) {
            return "";
        }
        if (tempConfig != null && tempConfig.get("userName") != null) {
            userName = tempConfig.get("userName");
        }
        return userName;
    }
}
