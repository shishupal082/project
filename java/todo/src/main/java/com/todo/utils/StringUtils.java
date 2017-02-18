package com.todo.utils;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.StringTokenizer;

/**
 * Created by shishupalkumar on 10/02/17.
 */
public class StringUtils {
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
}
