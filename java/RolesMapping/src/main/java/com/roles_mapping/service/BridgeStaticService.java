package com.roles_mapping.service;

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
}
