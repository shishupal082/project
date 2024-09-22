package com.project;

public class StaticService {
    public static void printLog(String str) {
        System.out.println(str);
    }
    public static void printLog(String str1, String str2) {
        System.out.println(str1 + str2);
    }
    public static void printLog(Integer str) {
        System.out.println(str);
    }
    public static void printLog(String[] str) {
        System.out.println(String.join(",",str));
    }
    public static void printLogSameLine(String str) {
        System.out.print(str);
    }
}
