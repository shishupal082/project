package com.project.sql;

import com.project.MysqlConnection;
import com.project.StaticService;

public class MysqlExecutor {
    private final String worldDB;
    private final String ftpAppDB;
    private final MysqlCredentials mysqlCredentials;
    public MysqlExecutor(MysqlCredentials mysqlCredentials) {
//        baseurl = "jdbc:mysql://localhost:3306"
        this.worldDB = mysqlCredentials.getBaseUrl() + "/world?autoReconnect=true&useSSL=false";
        this.ftpAppDB = mysqlCredentials.getBaseUrl() + "/ftpapp?autoReconnect=true&useSSL=false";
        this.mysqlCredentials = mysqlCredentials;
    }
    private void executeWorldDBQuery(String query) {
        MysqlConnection mysqlConnection = new MysqlConnection(worldDB, mysqlCredentials);
        mysqlConnection.Connect();
        mysqlConnection.executeCityTableQuery(query);
        mysqlConnection.close();
    }
    private void executeFtpAppDBQuery(String query) {
        MysqlConnection mysqlConnection = new MysqlConnection(ftpAppDB, mysqlCredentials);
        mysqlConnection.Connect();
        mysqlConnection.executeUsersQuery(query);
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
