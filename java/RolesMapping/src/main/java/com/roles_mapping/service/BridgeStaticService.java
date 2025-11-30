package com.roles_mapping.service;

import com.roles_mapping.config.BridgeConstant;

import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class BridgeStaticService {
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
    public static String getProjectWorkingDir() {
        String projectWorkingDirectory = System.getProperty("user.dir");
        return replaceChar(projectWorkingDirectory, "\\\\", "/");
    }
    public static boolean isInValidString (String str) {
        if (str == null) {
            return true;
        }
        str = str.trim();
        return str.isEmpty();
    }
    public static String[] splitStringOnLimit (String str, String regex, int limit) {
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
    public static Boolean isValidCondition(String cellData, ArrayList<String> range, ArrayList<String> notInRange,
                                    Boolean isEmpty, String regex) {
        if (range == null && notInRange == null && isEmpty == null && regex == null) {
            return null;
        }
        if (range != null && range.contains(cellData)) {
            return true;
        }
        if (notInRange != null && !notInRange.contains(cellData)) {
            return true;
        }
        if (regex != null && BridgeStaticService.isPatternMatching(cellData, regex, false)) {
            return true;
        }
        if (isEmpty != null) {
            if (isEmpty) {
                return BridgeConstant.EMPTY.equals(cellData);
            } else {
                return !BridgeConstant.EMPTY.equals(cellData);
            }
        }
        return false;
    }
}
