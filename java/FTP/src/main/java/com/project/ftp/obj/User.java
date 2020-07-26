package com.project.ftp.obj;

import com.project.ftp.config.AppConstant;
import com.project.ftp.service.StaticService;

import java.util.ArrayList;

public class User {
    private String username;
    private String password;
    private String displayName;
    private String passcode;
    private String timeStamp;
    private String method; // register, change_password
    private Integer userEntryCount;
    public User(String username, String password, String displayName) {
        this.username = username;
        this.password = password;
        this.displayName = displayName;
    }
    public String getAddTextResponse() {
        String text = "";
        if (username != null) {
            text += username + ",";
        } else {
            text += ",";
        }
        if (password != null) {
            text += StaticService.EncryptPassword(password) +",";
        } else {
            text += ",";
        }
        if (displayName != null) {
            text += displayName +",";
        } else {
            text += ",";
        }
        text += ","; // for passcode
        if (method != null) {
            text += method +",";
        } else {
            text += ",";
        }
        text += StaticService.getDateStrFromPattern(AppConstant.DateTimeFormat) + ",";
        return text;
    }
    public User(ArrayList<String> arrayList) {
        if (arrayList != null) {
            if (arrayList.size() >= 1) {
                userEntryCount = 1;
                username = arrayList.get(0);
            }
            if (arrayList.size() >= 2) {
                password = arrayList.get(1);
            }
            if (arrayList.size() >= 3) {
                displayName = arrayList.get(2);
            }
            if (arrayList.size() >= 4) {
                passcode = arrayList.get(3);
            }
            if (arrayList.size() >= 5) {
                method = arrayList.get(4);
            }
            if (arrayList.size() >= 6) {
                timeStamp = arrayList.get(5);
            }
        }
    }
    public User incrementEntryCount() {
        if (userEntryCount == null) {
            userEntryCount = 1;
        } else {
            userEntryCount++;
        }
        return this;
    }
    public String getUsername() {
        if (username != null && username.isEmpty()) {
            return null;
        }
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        if (password != null && password.isEmpty()) {
            return null;
        }
        return password;
    }

    public Integer getUserEntryCount() {
        return userEntryCount;
    }

    public void setUserEntryCount(Integer userEntryCount) {
        this.userEntryCount = userEntryCount;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getDisplayName() {
        if (displayName != null && displayName.isEmpty()) {
            return null;
        }
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getPasscode() {
        if (passcode != null && passcode.isEmpty()) {
            return null;
        }
        return passcode;
    }

    public void setPasscode(String passcode) {
        this.passcode = passcode;
    }

    public String getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(String timeStamp) {
        this.timeStamp = timeStamp;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    @Override
    public String toString() {
        return "User{" +
                "username='" + username + '\'' +
                ", password='" + "*****" + '\'' +
                ", displayName='" + displayName + '\'' +
                ", passcode='" + passcode + '\'' +
                ", timeStamp='" + timeStamp + '\'' +
                ", method='" + method + '\'' +
                ", userEntryCount=" + userEntryCount +
                '}';
    }
}
