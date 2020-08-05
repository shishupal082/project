package com.project.sql;

import com.project.MysqlConnection;
import com.project.StaticService;

public class MysqlExecutor {
    private final String worldDB;
    private final String ftpAppDB;
    private final String username;
    private final String password;
    public MysqlExecutor(String baseurl, String username, String password) {
//        baseurl = "jdbc:mysql://localhost:3306"
        this.worldDB = baseurl + "/world?autoReconnect=true&useSSL=false";
        this.ftpAppDB = baseurl + "/ftpapp?autoReconnect=true&useSSL=false";
        this.username = username;
        this.password = password;
    }
    private void executeWorldDBQuery(String query) {
        MysqlConnection mysqlConnection = new MysqlConnection(worldDB, username, password);
        mysqlConnection.Connect();
        mysqlConnection.query(query);
        mysqlConnection.close();
    }
    private void executeFtpAppDBQuery(String query) {
        MysqlConnection mysqlConnection = new MysqlConnection(ftpAppDB, username, password);
        mysqlConnection.Connect();
        mysqlConnection.queryV2(query);
        mysqlConnection.close();
    }
    public void executeQuery(String query) {
        if (query == null) {
            return;
        }
        if (query.contains("user")) {
            this.executeFtpAppDBQuery(query);
        } else if (query.contains("city")) {
            this.executeWorldDBQuery(query);
        } else {
            StaticService.printLog("query should contain users or city.");
        }
    }
}
