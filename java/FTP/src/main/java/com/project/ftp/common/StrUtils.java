package com.project.ftp.common;

public class StrUtils {
    public static String replaceLast(String find, String replace, String string) {
        int lastIndex = string.lastIndexOf(find);
        if (lastIndex == -1) {
            return string;
        }
        String beginString = string.substring(0, lastIndex);
        String endString = string.substring(lastIndex + find.length());
        return beginString + replace + endString;
    }
}
