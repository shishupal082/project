package com.project.ftp.service;

import com.project.ftp.config.AppConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SessionService {
    final static Logger logger = LoggerFactory.getLogger(FileService.class);
    final AppConfig appConfig;
    public SessionService(final AppConfig appConfig) {
        this.appConfig = appConfig;
    }
    public Boolean isLogin() {
        Boolean isLogin = true;
        return isLogin;
    }
    public String getLoginUserName() {
        String userName = "U1";
        return userName;
    }
}
