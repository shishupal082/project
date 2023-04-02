package com.project.rest.service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateService {
    public static String getDateStrFromPattern(String pattern) {
        String result = "";
        if (pattern == null) {
            return result;
        }
        Date currentDate = new Date();
        DateFormat dateFormat = new SimpleDateFormat(pattern);
        result = dateFormat.format(currentDate);
        return result;
    }
}
