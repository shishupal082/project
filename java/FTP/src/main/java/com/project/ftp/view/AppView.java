package com.project.ftp.view;

import com.project.ftp.config.AppConstant;
import com.project.ftp.obj.LoginUserDetails;
import com.project.ftp.service.UserService;
import io.dropwizard.views.View;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by shishupalkumar on 11/02/17.
 */
public class AppView extends View {
    final static Logger logger = LoggerFactory.getLogger(AppView.class);
    final String appVersion;
    final String pageName;
    final String isLogin;
    final String userName;
    final String isLoginUserAdmin;
    public AppView(HttpServletRequest request, LoginUserDetails loginUserDetails,
                   String pageName, final UserService userService) {
        super("app_view.ftl");
        this.pageName = pageName;
        this.isLogin = loginUserDetails.getLogin().toString();
        this.userName = loginUserDetails.getUsername();
        this.appVersion = AppConstant.AppVersion;
        this.isLoginUserAdmin = loginUserDetails.getLoginUserAdmin().toString();
        logger.info("Loading AppView: page={}", pageName);
    }

    public String getAppVersion() {
        return appVersion;
    }

    public String getPageName() {
        return pageName;
    }

    public String getIsLogin() {
        return isLogin;
    }

    public String getUserName() {
        return userName;
    }

    public String getIsLoginUserAdmin() {
        return isLoginUserAdmin;
    }
}
