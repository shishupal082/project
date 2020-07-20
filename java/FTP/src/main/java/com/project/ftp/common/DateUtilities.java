package com.project.ftp.common;

import java.text.DateFormat;
import java.text.SimpleDateFormat;

public class DateUtilities {
    public String getDateFromInMs(String format, Long timeInMs) {
        DateFormat dateFormat = new SimpleDateFormat(format);
        return dateFormat.format(timeInMs);
    }
}
