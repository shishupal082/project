package com.project.ftp.service;

import com.project.ftp.config.AppConfig;
import com.project.ftp.exceptions.AppException;
import com.project.ftp.exceptions.ErrorCodes;
import com.project.ftp.obj.LoginUserDetails;
import com.project.ftp.obj.RequestChangePassword;
import com.project.ftp.obj.RequestUserLogin;
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
        LoginUserDetails loginUserDetails = this.getLoginUserDetails(request);
        return loginUserDetails.getUsername();
    }
    private HashMap<String, String> getLoginUserResponse(HttpServletRequest request) {
        LoginUserDetails loginUserDetails = this.getLoginUserDetails(request);
        HashMap<String, String> result = new HashMap<>();
        result.put("isLogin", loginUserDetails.getLogin().toString());
        result.put("loginUserName", loginUserDetails.getUsername());
        result.put("isLoginUserAdmin", loginUserDetails.getLoginUserAdmin().toString());
        return result;
    }
    public Object getUserDataForLogging(HttpServletRequest request) {
        HashMap<String, String> result = new HashMap<>();
        LoginUserDetails loginUserDetails = this.getLoginUserDetails(request);
        result.put("loginUserName", loginUserDetails.getUsername());
        return result;
    }
    public Boolean isLoginUser(HttpServletRequest request) {
        LoginUserDetails loginUserDetails = this.getLoginUserDetails(request);
        return loginUserDetails.getLogin();
    }
    public Boolean isLoginUserDev(HttpServletRequest request) {
        LoginUserDetails loginUserDetails = this.getLoginUserDetails(request);
        return loginUserDetails.getLoginUserDev();
    }
    public LoginUserDetails getLoginUserDetails(HttpServletRequest request) {
        HashMap<String, String> tempConfig = appConfig.getFtpConfiguration().getTempConfig();
        if (tempConfig != null) {
            LoginUserDetails loginUserDetails = new LoginUserDetails();
            String loginUserName = tempConfig.get("userName");
            if (loginUserName != null) {
                loginUserDetails.setUsername(loginUserName);
                loginUserDetails.setLogin(sessionService.isUserLogin(loginUserName));
                loginUserDetails.setLoginUserDev(sessionService.isDevUser(loginUserName));
                loginUserDetails.setLoginUserAdmin(sessionService.isAdminUser(loginUserName));
                return loginUserDetails;
            }
        }
        return sessionService.getLoginUserDetails(request);
    }
    public HashMap<String, String> loginUser(HttpServletRequest request, RequestUserLogin userLogin) throws AppException {
        sessionService.loginUser(request, userLogin);
        HashMap<String, String> loginUserDetails = this.getLoginUserResponse(request);
        logger.info("loginUser success: {}", loginUserDetails);
        return loginUserDetails;
    }
    public void logoutUser(HttpServletRequest request) {
        LoginUserDetails loginUserDetails = this.getLoginUserDetails(request);
        logger.info("logout user: {}", loginUserDetails);
        sessionService.logoutUser(request);
    }
    public void changePassword(HttpServletRequest request, RequestChangePassword changePassword) throws AppException {
        if(!this.isLoginUser(request)) {
            logger.info("User not login, requested change password.");
            throw new AppException(ErrorCodes.UNAUTHORIZED_USER);
        }
        sessionService.changePassword(request, changePassword);
    }
}
