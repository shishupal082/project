package com.project.ftp.service;

import com.project.ftp.config.AppConfig;
import com.project.ftp.exceptions.AppException;
import com.project.ftp.obj.LoginUserDetails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;

public class UserService {
    final static Logger logger = LoggerFactory.getLogger(UserService.class);
    final AppConfig appConfig;
    final SessionService sessionService;
    public UserService(final AppConfig appConfig) {
        this.appConfig = appConfig;
        this.sessionService = new SessionService(appConfig);
    }
    public String getLoginUserName(HttpServletRequest request) {
        LoginUserDetails loginUserDetails = sessionService.getLoginUserDetails(request);
        return loginUserDetails.getUsername();
    }
    public HashMap<String, String> getLoginUserResponse(HttpServletRequest request) {
        LoginUserDetails loginUserDetails = sessionService.getLoginUserDetails(request);
        HashMap<String, String> result = new HashMap<>();
        result.put("isLogin", loginUserDetails.getLogin().toString());
        result.put("loginUserName", loginUserDetails.getUsername());
        result.put("isLoginUserAdmin", loginUserDetails.getLoginUserAdmin().toString());
        return result;
    }
    public Object getUserDataForLogging(HttpServletRequest request) {
        HashMap<String, String> result = new HashMap<>();
        LoginUserDetails loginUserDetails = sessionService.getLoginUserDetails(request);
        result.put("loginUserName", loginUserDetails.getUsername());
        return result;
    }
    public Boolean isLoginUserAdmin(HttpServletRequest request) {
        LoginUserDetails loginUserDetails = sessionService.getLoginUserDetails(request);
        return loginUserDetails.getLoginUserAdmin();
    }
    public Boolean isLoginUserDev(HttpServletRequest request) {
        LoginUserDetails loginUserDetails = sessionService.getLoginUserDetails(request);
        return loginUserDetails.getLoginUserDev();
    }
    public LoginUserDetails getLoginUserDetails(HttpServletRequest request) {
        return sessionService.getLoginUserDetails(request);
    }
    public void loginUser(HttpServletRequest request, String username, String password) throws AppException {
        sessionService.loginUser(request, username);
    }
    public void logoutUser(HttpServletRequest request) {
        sessionService.logoutUser(request);
    }
}
