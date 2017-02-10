package com.todo.utils;

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
}
