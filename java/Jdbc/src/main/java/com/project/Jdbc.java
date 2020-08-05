package com.project;

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
            StaticService.printLog("Min 3 database parameters required (url, username, password)");
            StaticService.printLog(args.length);
            Jdbc.exitApplication();
            return;
        }
        String url = args[0];
        String username = args[1];
        String password = args[2];
        StaticService.printLog("Hello Jdbc");
        MysqlConnection mysqlConnection = new MysqlConnection(url, username, password);
        mysqlConnection.Connect();
        String query;
        if (args.length >= 4) {
            query = args[3];
        } else {
            StaticService.printLogSameLine("Entry sql query: ");
            query = sc.nextLine();
        }
        mysqlConnection.query(query);
        mysqlConnection.close();
        Jdbc.exitApplication();
    }
}
