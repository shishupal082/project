package com.todo.utils;

import org.eclipse.jetty.util.StringUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Map;
import java.util.StringTokenizer;

/**
 * Created by shishupalkumar on 10/02/17.
 */
public class StringUtils {
    private static Logger logger = LoggerFactory.getLogger(StringUtils.class);
    public static ArrayList<String> tokanizeString(String str, String delimiter) {
        ArrayList<String> result = new ArrayList<String>();
        StringTokenizer st = new StringTokenizer(str, delimiter);
        while (st.hasMoreElements()) {
            result.add(st.nextToken());
        }
        return result;
    }
    public static String urlEncode(String str) {
        if (str == null) {
            return str;
        }
        try {
            return URLEncoder.encode(str, "UTF-8");
        } catch (UnsupportedEncodingException uee) {}
        return str;
    }
    public static Object[] getLoggerObject (Object o1, Object o2) {
        Object[] response = new Object[2];
        response[0] = o1;
        response[1] = o2;
        return response;
    }
    public static Object[] getLoggerObject (Object o1, Object o2, Object o3) {
        Object[] response = new Object[3];
        response[0] = o1;
        response[1] = o2;
        response[2] = o3;
        return response;
    }
    public static Object[] getLoggerObject (Object o1, Object o2, Object o3, Object o4) {
        Object[] response = new Object[4];
        response[0] = o1;
        response[1] = o2;
        response[2] = o3;
        response[3] = o4;
        return response;
    }
    public static ArrayList<Map<String, Object>> sortObjectArray(ArrayList<Map<String, Object>> obj, String param) {
        Map<String, Object> temp;
        if (obj == null) {
            logger.info("Obj is null");
            return null;
        }
        if (obj.isEmpty()) {
            logger.info("Obj is empty");
            return obj;
        }
        if (StringUtil.isBlank(param)) {
            logger.info("Param is null");
            return obj;
        }
        for (int i = 0; i < obj.size(); i++) {
            for (int j = i + 1; j < obj.size(); j++) {
                String str1 = (String) obj.get(i).get(param);
                String str2 = (String) obj.get(j).get(param);
                if (StringUtil.isBlank(str1) || StringUtil.isBlank(str2)) {
//                    logger.info("Comparing values str1 or str2 is null : {}, {}", str1, str2);
                    continue;
                }
                if (str1.compareTo(str2)>0) {
                    temp = obj.get(i);
                    obj.set(i, obj.get(j));
                    obj.set(j, temp);
                }
            }
        }
        return obj;
    }
    public static String getFileExtention(String fileName) {
        if (fileName == null) {
            return null;
        }
        String[] fileNameArr = fileName.split("\\.");
        return "." + fileNameArr[fileNameArr.length-1];
    }
    public static String getAbsoluteFileName(String fileName) {
        if (fileName == null) {
            return null;
        }
        String[] fileNameArr = fileName.split("\\.");
        String absFileName = "";
        for (int i=0; i<fileNameArr.length; i++) {
            if (i < fileNameArr.length-1) {
                absFileName += fileNameArr[i];
            }
        }
        return absFileName;
    }
}
