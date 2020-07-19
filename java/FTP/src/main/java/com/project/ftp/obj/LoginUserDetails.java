package com.project.ftp.obj;

public class LoginUserDetails {
    private String username;
    private Boolean isLogin;
    private Boolean isLoginUserAdmin;
    private Boolean isLoginUserDev;
    public LoginUserDetails() {
        username = "";
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
                ", isLogin=" + isLogin +
                ", isLoginUserAdmin=" + isLoginUserAdmin +
                ", isLoginUserDev=" + isLoginUserDev +
                '}';
    }
}
