package com.project;

import com.project.oracle.OracleApplication;
import com.project.sql.MysqlCredentials;
import com.project.sql.MysqlExecutor;

import java.util.Scanner;

public class JdbcApplication {
    private static final Scanner sc = new Scanner(System.in);
    public static void exitApplication() {
        StaticService.printLog("Press enter to exit.");
        sc.nextLine();
    }
    public static void run(String[] args) {
        StaticService.printLog(args);
        if (args.length < 3) {
            StaticService.printLog("Min 3 database parameters required (baseurl, username, password)");
            StaticService.printLog(args.length);
            JdbcApplication.exitApplication();
            return;
        }
        String baseurl = args[0];
        String username = args[1];
        String password = args[2];
        MysqlCredentials mysqlCredentials = new MysqlCredentials(null, baseurl, username, password);
        MysqlExecutor mysqlExecutor = new MysqlExecutor(mysqlCredentials);
        StaticService.printLog("Hello JdbcApplication");
        String query;
        if (args.length >= 4) {
            for (int i = 3; i < args.length; i++) {
                query = args[i];
                mysqlExecutor.executeQuery(query);
            }
        } else {
            StaticService.printLogSameLine("Entry sql query (city / users table): ");
            query = sc.nextLine();
            mysqlExecutor.executeQuery(query);
        }
        JdbcApplication.exitApplication();
    }
    public static void main(String[] args) {
        OracleApplication oracleApplication = new OracleApplication();
        oracleApplication.run();
    }
}
