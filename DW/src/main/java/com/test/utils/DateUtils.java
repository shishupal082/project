package com.test.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.TimeZone;

/**
 * Created by shishupal.kumar on 22/12/15.
 */
public class DateUtils {
    private final String formate;
    public DateUtils(String formate){
        this.formate = formate;
    }
    private static final Logger logger = LoggerFactory.getLogger(DateUtils.class);
    public String convertIstToGmt(String istDate) {
        logger.info("DateUtils: IST Date {} ",istDate);
        DateFormat formatter = new SimpleDateFormat(formate);
        DateFormat gmtFormat = new SimpleDateFormat(formate);
        TimeZone gmtTime = TimeZone.getTimeZone("GMT");
        gmtFormat.setTimeZone(gmtTime);
        String gmtDate = null;
        try {
            gmtDate = gmtFormat.format(formatter.parse(istDate));
           logger.info("DateUtils : GMT DATE {} ", gmtDate);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return gmtDate;
    }
}
