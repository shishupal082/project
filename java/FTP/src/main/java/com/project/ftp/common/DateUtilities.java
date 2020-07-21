package com.project.ftp.common;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtilities {
    public String getDateFromInMs(String format, Long timeInMs) {
        DateFormat dateFormat = new SimpleDateFormat(format);
        return dateFormat.format(timeInMs);
    }
    public String getDateStrFromPattern(String pattern) {
        Date currentDate = new Date();
        DateFormat dateFormat = new SimpleDateFormat(pattern);
        return dateFormat.format(currentDate);
    }
}
