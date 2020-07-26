package com.project.ftp.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class StrUtils {
    final static Logger logger = LoggerFactory.getLogger(StrUtils.class);
    public StrUtils() {}
    public String replaceLast(String find, String replace, String string) {
        int lastIndex = string.lastIndexOf(find);
        if (lastIndex == -1) {
            return string;
        }
        String beginString = string.substring(0, lastIndex);
        String endString = string.substring(lastIndex + find.length());
        return beginString + replace + endString;
    }
    public String replaceBackSlashToSlash(String str) {
        return this.replaceChar(str, "\\\\", "/");
    }
    public String replaceChar(String str, String find, String replace) {
        if (str == null || find == null || replace == null) {
            return null;
        }
        String result = "";
        char strChar;
        char findChar = find.charAt(0);
        for(int i=0; i<str.length(); i++) {
            strChar = str.charAt(i);
            if (strChar == findChar) {
                result = result.concat(replace);
                continue;
            }
            result = result + strChar;
        }
        return result;
    }
}
