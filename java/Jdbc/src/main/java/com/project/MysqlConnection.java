package com.project;

import com.project.sql.MysqlCredentials;
import com.project.tables.City;
import com.project.tables.User;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;

public class MysqlConnection {
    //"jdbc:mysql://127.0.0.1:3306/world??autoReconnect=true&useSSL=false"; (Here database name is world)
    private final String url;
    private final MysqlCredentials mysqlCredentials;
    private Connection con;
    public MysqlConnection(String url, MysqlCredentials mysqlCredentials) {
        this.url = url;
        this.mysqlCredentials = mysqlCredentials;
    }
    private void logParam() {
        StaticService.printLog(mysqlCredentials.toString());
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
            Class.forName(mysqlCredentials.getDriver());
            con = DriverManager.getConnection(url, mysqlCredentials.getUsername(), mysqlCredentials.getPassword());
            StaticService.printLog("Connection success");
        } catch (Exception e) {
            StaticService.printLog("Connection fail");
            e.printStackTrace();
        }
    }
    public void executeCityTableQuery(String query) {
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
    public void executeUsersQuery(String query) {
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
