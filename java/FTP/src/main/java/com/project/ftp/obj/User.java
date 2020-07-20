package com.project.ftp.obj;

import java.util.ArrayList;

public class User {
    private String username;
    private String password;
    private String displayName;
    private Integer userEntryCount;
    public User(ArrayList<String> arrayList) {
        if (arrayList != null) {
            if (arrayList.size() >= 2) {
                userEntryCount = 1;
                username = arrayList.get(0);
                password = arrayList.get(1);
            }
            if (arrayList.size() >= 3) {
                displayName = arrayList.get(2);
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
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
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
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    @Override
    public String toString() {
        return "User{" +
                "username='" + username + '\'' +
                ", password='" + "*****" + '\'' +
                ", displayName='" + displayName + '\'' +
                ", userEntryCount=" + userEntryCount +
                '}';
    }
}
