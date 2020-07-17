package com.project.ftp.service;

import com.project.ftp.config.AppConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;

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
    public Object getUserDataForLogging() {
        HashMap<String, String> result = new HashMap<>();
        result.put("loginUserName", getLoginUserName());
        result.put("isLogin", isLogin().toString());
        return result;
    }
    public Boolean isLoginUserAdmin() {
        String loginUserName = getLoginUserName();
        ArrayList<String> adminUserNames = appConfig.getFtpConfiguration().getAdminUsersName();
        if (!loginUserName.isEmpty() && adminUserNames != null) {
            return adminUserNames.contains(loginUserName);
        }
        return false;
    }
    public Boolean isLoginUserDev() {
        String loginUserName = getLoginUserName();
        ArrayList<String> devUserNames = appConfig.getFtpConfiguration().getDevUsersName();
        if (!loginUserName.isEmpty() && devUserNames != null) {
            return devUserNames.contains(loginUserName);
        }
        return false;
    }
}
