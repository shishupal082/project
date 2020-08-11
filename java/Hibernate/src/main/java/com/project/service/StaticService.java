package com.project.service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class StaticService {
    public static String getDateStrFromPattern(String pattern) {
        if (pattern == null) {
            return "";
        }
        Date currentDate = new Date();
        DateFormat dateFormat = new SimpleDateFormat(pattern);
        return dateFormat.format(currentDate);
    }
}
