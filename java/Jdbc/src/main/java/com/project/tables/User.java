package com.project.tables;


import java.sql.ResultSet;

public class User {
    /**
     * Entity's unique identifier.
     */
    private long id;

    private String username;

    private String password;

    private String mobile;

    private String email;

    private String name;

    private String passcode;

    private String method;

    private String timestamp;

    private boolean deleted;

    public User(ResultSet set) {
        if (set == null) {
            return;
        }
        try {
            id = set.getInt("id");
            username = set.getString("username");
            password = set.getString("password");
            mobile = set.getString("mobile");
            email = set.getString("email");
            name = set.getString("name");
            passcode = set.getString("passcode");
            method = set.getString("method");
            timestamp = set.getString("timeStamp");
            deleted = set.getBoolean("deleted");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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

    public void setPassword(String password) {
        this.password = password;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPasscode() {
        return passcode;
    }

    public void setPasscode(String passcode) {
        this.passcode = passcode;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    @Override
    public String toString() {
        return "MysqlUsers{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", mobile='" + mobile + '\'' +
                ", email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", passcode='" + passcode + '\'' +
                ", method='" + method + '\'' +
                ", timestamp='" + timestamp + '\'' +
                ", deleted=" + deleted +
                '}';
    }
}
