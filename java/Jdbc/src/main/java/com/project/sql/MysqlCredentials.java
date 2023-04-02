package com.project.sql;

public class MysqlCredentials {
    private String driver;
    private String baseUrl;
    private String username;
    private String password;

    public MysqlCredentials(String driver, String baseUrl, String username, String password) {
        this.driver = "com.mysql.jdbc.Driver";
        this.baseUrl = baseUrl;
        this.username = username;
        this.password = password;
    }
    public String getDriver() {
        return driver;
    }

    public void setDriver(String driver) {
        this.driver = driver;
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
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

    @Override
    public String toString() {
        return "MysqlCredentials{" +
                "driver='" + driver + '\'' +
                ", url='" + baseUrl + '\'' +
                ", username='" + username + '\'' +
                ", password='" + "*****" + '\'' +
                '}';
    }
}
