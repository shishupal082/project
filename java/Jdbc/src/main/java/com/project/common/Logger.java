package com.project.common;

import com.project.StaticService;

public class Logger {
    public Logger() {}
    public static void info(String str) {
        StaticService.printLog(str);
    }
    public static void info(String str1, String str2) {
        StaticService.printLog(str1, str2);
    }
    public static void info(String str1, String str2, String str3) {
        StaticService.printLog(str1, str2 + str3);
    }
    public static void info(String str1, String str2, String str3, String str4) {
        StaticService.printLog(str1, str2 + str3 + str4);
    }
}
