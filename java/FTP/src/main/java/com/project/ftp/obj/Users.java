package com.project.ftp.obj;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class Users {
    private HashMap<String, User> userHashMap;
    private Integer userCount = 0;
    public Users(ArrayList<ArrayList<String>> filedata) {
        if (filedata != null) {
            userHashMap = new HashMap<>();
            User user, updatedUser;
            for(int i=filedata.size()-1; i>=0; i--) {
                user = new User(filedata.get(i));
                if (user.getUsername() != null && !user.getUsername().isEmpty()) {
                    updatedUser = userHashMap.get(user.getUsername());
                    if (updatedUser == null) {
                        userHashMap.put(user.getUsername(), user);
                        userCount++;
                    } else {
                        userHashMap.put(user.getUsername(), updatedUser.incrementEntryCount());
                    }
                }
            }
        }
    }
    public HashMap<String, User> getUserHashMap() {
        return userHashMap;
    }

    public void setUserHashMap(HashMap<String, User> userHashMap) {
        this.userHashMap = userHashMap;
    }

    public Integer getUserCount() {
        return userCount;
    }

    public void setUserCount(Integer userCount) {
        this.userCount = userCount;
    }

    public User searchUserByName(String username) {
        if (username == null) {
            return null;
        }
        if (userHashMap != null) {
            return userHashMap.get(username);
        }
        return null;
    }
    public void maskPassword() {
        if (userHashMap != null) {
            String userId;
            User user;
            for(Map.Entry<String, User> data: userHashMap.entrySet()) {
                data.getValue().setPassword("*****");
            }
        }
    }

    @Override
    public String toString() {
        return "Users{" +
                "userHashMap=" + userHashMap +
                ", userCount=" + userCount +
                '}';
    }
}
