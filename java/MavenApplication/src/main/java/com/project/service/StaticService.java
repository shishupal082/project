package com.project.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StaticService {
    private final static Logger logger = LoggerFactory.getLogger(StaticService.class);

    public static String[] splitStringOnLimit(String str, String regex, int limit) {
        if (str == null) {
            return null;
        }
        if (regex == null) {
            regex = ",";
        }
        /*
        * For input ///d/workspace/project//ftp/application///
        * for no limit, result = []: [, , , d, workspace, project, , ftp, application],9
        * for limit = -1, result = []:  [, , , d, workspace, project, , ftp, application, , , ],12
        * for limit = 0, result = []: [, , , d, workspace, project, , ftp, application],9
        * for limit = 1, result = []:  [///d/workspace/project//ftp/application///],1
        *
        * For input /d/workspace/project//ftp/application/
        * for no limit, result = []: [, d, workspace, project, , ftp, application],7
        * for limit = -1, result = []:  [, d, workspace, project, , ftp, application, ],8
        * for limit = 0, result = []:  [, d, workspace, project, , ftp, application],7
        * for limit = 1, result = []:  [/d/workspace/project//ftp/application/],1
        * for limit = 3, result = []:  [, d, workspace/project//ftp/application/],3
        * */
        return str.split(regex, limit);
    }
    public static String replaceLast(String find, String replace, String string) {
        int lastIndex = string.lastIndexOf(find);
        if (lastIndex == -1) {
            return string;
        }
        String beginString = string.substring(0, lastIndex);
        String endString = string.substring(lastIndex + find.length());
        return beginString + replace + endString;
    }
    public static String replaceChar(String str, String find, String replace) {
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
    public static boolean isPatternMatching(String str, String pattern, boolean exactMatch) {
        if (str == null || pattern == null) {
            return false;
        }
        if (str.isEmpty() || pattern.trim().isEmpty()) {
            return false;
        }
        if (exactMatch) {
            pattern = "^" + pattern + "$";
        }
        Pattern regexPattern = Pattern.compile(pattern, Pattern.CASE_INSENSITIVE);
        Matcher matcher = regexPattern.matcher(str);
        return matcher.find();
    }
    public static String getProperDirString(String path) {
        if (path == null) {
            return null;
        }
        path = getProperDirStringV2(path);
        return StaticService.replaceLast("/", "", path);
    }
    public static String getProperDirStringV2(String path) {
        if (path == null) {
            return null;
        }
        path = replaceBackSlashToSlash(path);
        path = path + "/";
        return path.replaceAll("/+", "/");
    }
    //Test case written for this
    public static String removeRelativePath(String path) {
        if (path == null) {
            return null;
        }
        path = replaceBackSlashToSlash(path);
        if (path.contains("/./")) {
            return removeRelativePath(path.replaceAll("/./", "/"));
        }
        if (path.contains("/../")) {
            return removeRelativePath(path.replaceAll("/../", "/"));
        }
        return path.replaceAll("/+", "/");
    }
    public static String replaceComma(String str) {
        if (str == null) {
            return null;
        }
        str = str.trim();
        return StaticService.replaceChar(str,",", "..");
    }
    public static String encodeComma(String str) {
        if (str == null) {
            return null;
        }
        str = str.trim();
        return StaticService.replaceChar(str,",", "```");
    }
    public static String decodeComma(String str) {
        if (str == null) {
            return null;
        }
        str = str.trim();
        return StaticService.replaceString(str,"```", ",");
    }
    public static String replaceString(String str, String find, String replace) {
        if (str == null || find == null || replace == null) {
            return str;
        }
        return str.replaceAll(find, replace);
    }
    public static boolean isInValidString(String str) {
        if (str == null) {
            return true;
        }
        str = str.trim();
        return str.isEmpty();
    }
    public static boolean isValidString(String str) {
        return !StaticService.isInValidString(str);
    }
    public static String truncateString(String str, int maxLength) {
        if (str == null) {
            return null;
        }
        if (str.length() <= maxLength) {
            return str;
        }
        return str.substring(0, maxLength);
    }
    public static String urlEncode(String url) {
        if (url == null) {
            return url;
        }
        url = replaceString(url, "%26", "&");
        url = replaceString(url, "%20", " ");
        url = replaceString(url, "\"", "");
        url = replaceString(url, "\\.\\.\\.", ",");
        return url;
    }
    public static void printLog(Object logStr) {
        System.out.println(logStr);
    }
    public static String replaceBackSlashToSlash(String str) {
        return StaticService.replaceChar(str, "\\\\", "/");
    }
    public static String getProjectWorkingDir() {
        String projectWorkingDirectory = System.getProperty("user.dir");
        return StaticService.replaceBackSlashToSlash(projectWorkingDirectory);
    }
    public static String joinWithComma(String str1, String str2) {
        if (StaticService.isInValidString(str2)) {
            return str1;
        }
        if (StaticService.isValidString(str1)) {
            str1 += "," + str2;
        } else {
            str1 = str2;
        }
        return str1;
    }
    public static String joinWithCommaV2(String str1, String str2, String str3) {
        str1 = StaticService.joinWithComma(str1, str2);
        return StaticService.joinWithComma(str1, str3);
    }
    public static String join(String joinDelimiter, String str1, String str2) {
        if (StaticService.isInValidString(str2)) {
            return str1;
        }
        if (StaticService.isInValidString(joinDelimiter)) {
            joinDelimiter = "";
        }
        if (StaticService.isValidString(str1)) {
            str1 += joinDelimiter + str2;
        } else {
            str1 = str2;
        }
        return str1;
    }
    public static String joinV2(String joinDelimiter, String str1, String str2, String str3) {
        str1 = StaticService.join(joinDelimiter, str1, str2);
        return StaticService.join(joinDelimiter, str1, str3);
    }
    public static String getRandomNumber(int min, int max) {
        int random = (int) ((Math.random() * (max - min)) + min);
        return String.valueOf(random);
    }
    public static int strToInt(String str) {
        int result = 0;
        try {
            result = Integer.parseInt(str);
        } catch (Exception ignored) {}
        return result;
    }
    public static String createUUIDNumber() {
        return UUID.randomUUID().toString();
    }
}
