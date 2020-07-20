package com.project.ftp.service;

import com.project.ftp.config.AppConfig;
import com.project.ftp.config.AppConstant;
import com.project.ftp.exceptions.AppException;
import com.project.ftp.exceptions.ErrorCodes;
import com.project.ftp.obj.*;
import com.project.ftp.parser.TextFileParser;
import com.project.ftp.session.SessionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;

public class UserService {
    final static Logger logger = LoggerFactory.getLogger(UserService.class);
    final AppConfig appConfig;
    final SessionService sessionService;
    public UserService(final AppConfig appConfig) {
        this.appConfig = appConfig;
        this.sessionService = new SessionService(appConfig);
    }
    public Users getAllUser() throws AppException {
        Users users = null;
        TextFileParser textFileParser = new TextFileParser(appConfig);
        ArrayList<ArrayList<String>> fileData;
        try {
            fileData = textFileParser.getTextData();
            users = new Users(fileData);
            logger.info("AllUser data: {}", users);
        } catch (AppException ae) {
            logger.info("Error in getting all usersData");
            throw new AppException(ErrorCodes.RUNTIME_ERROR);
        }
        return users;
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
    private void isUserPasswordMatch(String username, String password, Boolean checkLimitExceed) throws AppException {
        Users users = this.getAllUser();
        User user = users.searchUserByName(username);
        if (user == null) {
            logger.info("username: {}, is not found.", username);
            throw new AppException(ErrorCodes.USER_NOT_FOUND);
        }
        if (password == null || !password.equals(user.getPassword())) {
            logger.info("password mismatch for username: {}", username);
            throw new AppException(ErrorCodes.PASSWORD_NOT_MATCHING);
        }
        if (user.getUserEntryCount() != null && checkLimitExceed) {
            if (user.getUserEntryCount() >= AppConstant.ALLOWED_PASS_CHANGE_COUNT) {
                throw new AppException(ErrorCodes.PASSWORD_CHANGE_COUNT_EXCEED);
            }
        }
    }
    public HashMap<String, String> loginUser(HttpServletRequest request, RequestUserLogin userLogin) throws AppException {
        if (userLogin == null) {
            logger.info("loginUser request is null.");
            throw new AppException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        isUserPasswordMatch(userLogin.getUsername(), userLogin.getPassword(), false);
        sessionService.loginUser(request, userLogin);
        HashMap<String, String> loginUserDetails = this.getLoginUserResponse(request);
        logger.info("loginUser success: {}", loginUserDetails);
        return loginUserDetails;
    }
    public void changePassword(HttpServletRequest request, RequestChangePassword changePassword) throws AppException {
        LoginUserDetails loginUserDetails = this.getLoginUserDetails(request);
        if(!loginUserDetails.getLogin()) {
            logger.info("User not login, requested change password.");
            throw new AppException(ErrorCodes.UNAUTHORIZED_USER);
        }
        if (changePassword == null) {
            logger.info("changePassword request is null.");
            throw new AppException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        String newPassword = changePassword.getNew_password();
        String confirmPassword = changePassword.getConfirm_password();
        if (newPassword == null || newPassword.isEmpty()) {
            logger.info("changePassword request new_password is incorrect: {}", newPassword);
            throw new AppException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        if (confirmPassword == null || confirmPassword.isEmpty()) {
            logger.info("changePassword request confirm_password is incorrect: {}", confirmPassword);
            throw new AppException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        if (!newPassword.equals(confirmPassword)) {
            logger.info("changePassword request mismatch, new_password: {}, confirm_password{}",
                    newPassword, confirmPassword);
            throw new AppException(ErrorCodes.PASSWORD_NOT_MATCHING2);
        }
        String oldPassword = changePassword.getOld_password();
        if (oldPassword == null || oldPassword.isEmpty()) {
            logger.info("changePassword request old_password is incorrect: {}", oldPassword);
            throw new AppException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        isUserPasswordMatch(loginUserDetails.getUsername(), oldPassword, true);
        logger.info("change password success.");
        TextFileParser textFileParser = new TextFileParser(appConfig);
        Users users = this.getAllUser();
        User user = users.searchUserByName(loginUserDetails.getUsername());
        String text = user.getUsername() + "," + newPassword + ",";
        text += user.getDisplayName();
        Boolean changePasswordStatus = textFileParser.addText(text);
        if (!changePasswordStatus) {
            throw new AppException(ErrorCodes.RUNTIME_ERROR);
        }
    }
    public void logoutUser(HttpServletRequest request) {
        LoginUserDetails loginUserDetails = this.getLoginUserDetails(request);
        logger.info("logout user: {}", loginUserDetails);
        sessionService.logoutUser(request);
    }
    public void isLoginUserAdmin(HttpServletRequest request) throws AppException {
        LoginUserDetails loginUserDetails = this.getLoginUserDetails(request);
        if (!loginUserDetails.getLoginUserAdmin()) {
            logger.info("UnAuthorised user trying to access restricted admin data: {}", loginUserDetails);
            throw new AppException(ErrorCodes.UNAUTHORIZED_USER);
        }
    }
}
