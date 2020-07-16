package com.project.ftp.service;

import com.project.ftp.config.AppConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;

public class UserService {
    final static Logger logger = LoggerFactory.getLogger(FileService.class);
    final AppConfig appConfig;
    final SessionService sessionService;
    public UserService(final AppConfig appConfig) {
        this.appConfig = appConfig;
        this.sessionService = new SessionService(appConfig);
    }
    public Boolean isLogin() {
        return sessionService.isLogin();
    }
    public String getLoginUserName() {
        return  sessionService.getLoginUserName();
    }
    public Boolean isLoginUserAdmin() {
        String loginUserName = sessionService.getLoginUserName();
        ArrayList<String> adminUserNames = appConfig.getFtpConfiguration().getAdminUserNames();
        if (adminUserNames != null) {
            return adminUserNames.contains(loginUserName);
        }
        return false;
    }
}
