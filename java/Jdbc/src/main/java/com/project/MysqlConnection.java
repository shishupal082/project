package com.project;

import com.project.tables.City;
import com.project.tables.User;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;

public class MysqlConnection {
    private final String driver = "com.mysql.jdbc.Driver";
    //"jdbc:mysql://127.0.0.1:3306/world??autoReconnect=true&useSSL=false"; (Here database name is world)
    private final String url;
    private final String username;
    private final String password;
    private Connection con;
    public MysqlConnection(String url, String username, String password) {
        this.url = url;
        this.username = username;
        this.password = password;
    }
    private void logParam() {
        String connectionRequest = driver+";"+url+";"+username+";"+password;
        StaticService.printLog(connectionRequest);
    }
    public void close() {
        if (con == null) {
            StaticService.printLog("MySQL connection not found");
            return;
        }
        try {
            con.close();
            StaticService.printLog("Connection closed");
        } catch (Exception e) {
            StaticService.printLog("Error in closing connection");
            e.printStackTrace();
        }
    }
    public void Connect() {
        this.logParam();
        try {
            Class.forName(driver);
            con = DriverManager.getConnection(url, username, password);
            StaticService.printLog("Connection success");
        } catch (Exception e) {
            StaticService.printLog("Connection fail");
            e.printStackTrace();
        }
    }
    public void query(String query) {
        String str = "Requested query: " + query;
        StaticService.printLog(str);
        ArrayList<City> cities = new ArrayList<>();
        try {
            Statement stmt = con.createStatement();
            ResultSet rs = stmt.executeQuery(query);
            while (rs.next()) {
                cities.add(new City(rs));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        for (City city: cities) {
            StaticService.printLog(city.toString());
        }
    }
    public void queryV2(String query) {
        String str = "Requested query: " + query;
        StaticService.printLog(str);
        ArrayList<User> users = new ArrayList<>();
        try {
            Statement stmt = con.createStatement();
            ResultSet rs = stmt.executeQuery(query);
            while (rs.next()) {
                users.add(new User(rs));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        for (User user: users) {
            StaticService.printLog(user.toString());
        }
    }
}
