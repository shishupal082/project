package com.project.ftp.obj;

public class LoginUserDetails {
    private String username;
    private String displayName;
    private Boolean isLogin;
    private Boolean isLoginUserAdmin;
    private Boolean isLoginUserDev;
    /* Why added displayName?
    * It will be required for api/get_login_user_details (Right now it is not used)
    * */
    public LoginUserDetails() {
        username = "";
        displayName = "";
        isLogin = false;
        isLoginUserAdmin = false;
        isLoginUserDev = false;
    }
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public Boolean getLogin() {
        return isLogin;
    }

    public void setLogin(Boolean login) {
        isLogin = login;
    }

    public Boolean getLoginUserAdmin() {
        return isLoginUserAdmin;
    }

    public void setLoginUserAdmin(Boolean loginUserAdmin) {
        isLoginUserAdmin = loginUserAdmin;
    }

    public Boolean getLoginUserDev() {
        return isLoginUserDev;
    }

    public void setLoginUserDev(Boolean loginUserDev) {
        isLoginUserDev = loginUserDev;
    }

    @Override
    public String toString() {
        return "LoginUserDetails{" +
                "username='" + username + '\'' +
                ", displayName='" + displayName + '\'' +
                ", isLogin=" + isLogin +
                ", isLoginUserAdmin=" + isLoginUserAdmin +
                ", isLoginUserDev=" + isLoginUserDev +
                '}';
    }
}
