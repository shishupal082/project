package com.project.ftp.session;

public class SessionUserInfo {
    private String userName;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    @Override
    public String toString() {
        return "SessionUserInfo{" +
                "userName='" + userName + '\'' +
                '}';
    }
}
