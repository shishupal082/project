package com.project.ftp.obj;

import java.util.ArrayList;
import java.util.HashMap;

public class Users {
    private HashMap<String, User> userHashMap;
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
    public User searchUserByName(String username) {
        if (username == null) {
            return null;
        }
        if (userHashMap != null) {
            return userHashMap.get(username);
        }
        return null;
    }
    @Override
    public String toString() {
        return "Users{" +
                "userHashMap=" + userHashMap +
                '}';
    }
}
