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
            logger.info("Available user count: {}", users.getUserCount());
        } catch (AppException ae) {
            logger.info("Error in getting all usersData");
            throw new AppException(ErrorCodes.RUNTIME_ERROR);
        }
        return users;
    }
    private User getUserDataByUserName(String username) {
        if (username == null) {
            return null;
        }
        User user = null;
        try {
            Users users = this.getAllUser();
            user = users.searchUserByName(username);
            logger.info("User data for username: {}, is: {}", username, user);
        } catch (AppException ae) {
            logger.info("Error in getting all userDataByUserName: {}", username);
        }
        return user;
    }
    public String getUserDisplayName(final String username) {
        String userDisplayName = null;
        User user = this.getUserDataByUserName(username);
        if (user != null) {
            userDisplayName = user.getDisplayName();
        }
        return userDisplayName;
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
    public Boolean isLoginUserDev(HttpServletRequest request) {
        LoginUserDetails loginUserDetails = this.getLoginUserDetails(request);
        return loginUserDetails.getLoginUserDev();
    }
    private Boolean isAdminUser(String loginUserName) {
        ArrayList<String> adminUserNames = appConfig.getFtpConfiguration().getAdminUsersName();
        if (adminUserNames != null && loginUserName != null && !loginUserName.isEmpty()) {
            return adminUserNames.contains(loginUserName);
        }
        return false;
    }
    private Boolean isDevUser(String loginUserName) {
        ArrayList<String> devUsersName = appConfig.getFtpConfiguration().getDevUsersName();
        if (devUsersName != null && loginUserName != null && !loginUserName.isEmpty()) {
            return devUsersName.contains(loginUserName);
        }
        return  false;
    }
    private Boolean isUserLogin(String loginUserName) {
        if (loginUserName != null && !loginUserName.isEmpty()) {
            return true;
        }
        return false;
    }
    public LoginUserDetails getLoginUserDetails(HttpServletRequest request) {
        LoginUserDetails loginUserDetails = new LoginUserDetails();
        String loginUserName = sessionService.getLoginUserName(request);
        if (loginUserName != null) {
            loginUserDetails.setUsername(loginUserName);
            loginUserDetails.setLogin(this.isUserLogin(loginUserName));
            loginUserDetails.setLoginUserDev(this.isDevUser(loginUserName));
            loginUserDetails.setLoginUserAdmin(this.isAdminUser(loginUserName));
        }
        return loginUserDetails;
    }
    // Login, Change password
    private User isUserPasswordMatch(String username, String password,
                                     ErrorCodes emptyPasswordErrorCode,
                                     ErrorCodes passwordMisMatchErrorCode) throws AppException {
        if (username == null || username.isEmpty()) {
            logger.info("username required: {}.", username);
            throw new AppException(ErrorCodes.USER_NAME_REQUIRED);
        }
        User user = this.getUserDataByUserName(username);
        if (user == null) {
            logger.info("username: {}, is not found.", username);
            throw new AppException(ErrorCodes.USER_NOT_FOUND);
        }
        if (password == null || password.isEmpty()) {
            logger.info("password mismatch for username: {}", username);
            throw new AppException(emptyPasswordErrorCode);
        }
        password = StaticService.EncryptPassword(password);
        if (!password.equals(user.getPassword())) {
            logger.info("password mismatch for username: {}", username);
            throw new AppException(passwordMisMatchErrorCode);
        }
        return user;
    }
    // register, change password
    private void isValidNewPassword(String password) throws AppException {
        if (password == null || password.isEmpty()) {
            logger.info("Password should not be null or empty: {}", password);
            throw new AppException(ErrorCodes.PASSWORD_NEW_REQUIRED);
        }
        int passwordLength = password.length();
        if (passwordLength > 14 || passwordLength < 8) {
            logger.info("Password length: {},  (8 to 14) mismatch.", password.length());
            throw new AppException(ErrorCodes.PASSWORD_LENGTH_MISMATCH);
        }
        logger.info("Password policy match.");
    }
    // register
    private void isUserPasscodeMatch(String username, String passcode) throws AppException {
        if (username == null || username.isEmpty()) {
            logger.info("username required: {}.", username);
            throw new AppException(ErrorCodes.USER_NAME_REQUIRED);
        }
        if (passcode == null || passcode.isEmpty()) {
            logger.info("username required: {}.", username);
            throw new AppException(ErrorCodes.REGISTER_PASSCODE_REQUIRED);
        }
        User user = this.getUserDataByUserName(username); // It will check for null
        if (user == null) {
            logger.info("username: {}, is not found.", username);
            throw new AppException(ErrorCodes.USER_NOT_FOUND);
        }
        if (!passcode.equals(user.getPasscode())) {
            logger.info("passcode: {}, mismatch for user: {}", passcode, user);
            throw new AppException(ErrorCodes.REGISTER_PASSCODE_NOT_MATCHING);
        }
        logger.info("passcode: {}, match with user: {}", passcode, user);
    }
    public HashMap<String, String> loginUser(HttpServletRequest request, RequestUserLogin userLogin) throws AppException {
        if (userLogin == null) {
            logger.info("loginUser request is null.");
            throw new AppException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        this.isUserPasswordMatch(userLogin.getUsername(), userLogin.getPassword(),
                ErrorCodes.PASSWORD_REQUIRED, ErrorCodes.PASSWORD_NOT_MATCHING);
        sessionService.loginUser(request, userLogin.getUsername());
        HashMap<String, String> loginUserDetails = this.getLoginUserResponse(request);
        logger.info("loginUser success: {}", loginUserDetails);
        return loginUserDetails;
    }
    public void userRegister(HttpServletRequest request, RequestUserRegister userRegister) throws AppException {
        if (userRegister == null) {
            logger.info("userRegister request is null.");
            throw new AppException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        String username = userRegister.getUsername();
        this.isUserPasscodeMatch(username, userRegister.getPasscode());
        String password = userRegister.getPassword();
        this.isValidNewPassword(password);
        String displayName = userRegister.getDisplay_name();
        if (displayName == null || displayName.isEmpty()) {
            logger.info("displayName is empty: {}", userRegister);
            throw new AppException(ErrorCodes.REGISTER_NAME_REQUIRED);
        }
        logger.info("User register parameter are ok: {}", userRegister);
        TextFileParser textFileParser = new TextFileParser(appConfig);
        User user = new User(username, password, displayName);
        user.setMethod("register");
        String text = user.getAddTextResponse();

        Boolean createUserStatus = textFileParser.addText(text);
        if (!createUserStatus) {
            logger.info("Create user failed: {}", userRegister);
            throw new AppException(ErrorCodes.RUNTIME_ERROR);
        }
        sessionService.loginUser(request, username);
        logger.info("userRegister success: {}", user);
    }
    public void changePassword(HttpServletRequest request, RequestChangePassword changePassword) throws AppException {
        LoginUserDetails loginUserDetails = this.getLoginUserDetails(request);
        if(!loginUserDetails.getLogin()) {
            logger.info("User not login, requested for change password.");
            throw new AppException(ErrorCodes.UNAUTHORIZED_USER);
        }
        if (changePassword == null) {
            logger.info("changePassword request is null.");
            throw new AppException(ErrorCodes.BAD_REQUEST_ERROR);
        }
        String newPassword = changePassword.getNew_password();
        String confirmPassword = changePassword.getConfirm_password();
        this.isValidNewPassword(newPassword);
        if (!newPassword.equals(confirmPassword)) {
            logger.info("changePassword request mismatch, new_password: {}, confirm_password{}",
                    newPassword, confirmPassword);
            throw new AppException(ErrorCodes.PASSWORD_CHANGE_NOT_MATCHING);
        }
        String oldPassword = changePassword.getOld_password();
        User user = this.isUserPasswordMatch(loginUserDetails.getUsername(), oldPassword,
                ErrorCodes.PASSWORD_CHANGE_OLD_REQUIRED,
                ErrorCodes.PASSWORD_CHANGE_OLD_NOT_MATCHING);

        if (user.getUserEntryCount() != null) {
            int limit = AppConstant.MAX_ENTRY_ALLOWED_IN_USER_DATA_FILE;
            if (user.getUserEntryCount() >= limit) {
                logger.info("Password change count limit: {}, exceed: {}", limit, user);
                throw new AppException(ErrorCodes.PASSWORD_CHANGE_COUNT_EXCEED);
            }
        }
        user.setPassword(newPassword);
        user.setMethod("change_password");
        String text = user.getAddTextResponse();
        TextFileParser textFileParser = new TextFileParser(appConfig);
        Boolean changePasswordStatus = textFileParser.addText(text);
        if (!changePasswordStatus) {
            logger.info("Error in updating password.");
            throw new AppException(ErrorCodes.RUNTIME_ERROR);
        }
        logger.info("change password success: {}", user);
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
