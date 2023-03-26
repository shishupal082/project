package com.project;

import com.project.sql.MysqlCredentials;
import com.project.sql.MysqlExecutor;

import java.util.Scanner;

public class Jdbc {
    private static final Scanner sc = new Scanner(System.in);
    public static void exitApplication() {
        StaticService.printLog("Press enter to exit.");
        sc.nextLine();
    }
    public static void main(String[] args) {
        StaticService.printLog(args);
        if (args.length < 3) {
            StaticService.printLog("Min 3 database parameters required (baseurl, username, password)");
            StaticService.printLog(args.length);
            Jdbc.exitApplication();
            return;
        }
        String baseurl = args[0];
        String username = args[1];
        String password = args[2];
        MysqlCredentials mysqlCredentials = new MysqlCredentials(null, baseurl, username, password);
        MysqlExecutor mysqlExecutor = new MysqlExecutor(mysqlCredentials);
        StaticService.printLog("Hello Jdbc");
        String query;
        if (args.length >= 4) {
//            for(int i=3; i< args.length; i++) {
//                query = args[i];
//                mysqlExecutor.executeQuery(query);
//            }
            StaticService.printLogSameLine("Invalid config parameter.");
        } else {
            StaticService.printLogSameLine("Entry sql query (city / users table): ");
            query = sc.nextLine();
            mysqlExecutor.executeQuery(query);
        }
        Jdbc.exitApplication();
    }
}
