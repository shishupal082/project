package com.test.service;

import com.test.domain.test.DateResponse;
import com.test.utils.DateUtils;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by shishupal.kumar on 22/12/15.
 */
public class TestService {
    private String format = "yyyy-MM-dd HH:mm:ss";
    public TestService(){}
    public DateResponse getCurrentDate(){
        Date date = new Date();
        DateFormat dateFormat = new SimpleDateFormat(format);
        DateUtils dateUtils = new DateUtils(format);

        final DateResponse dateResponse = new DateResponse();
        dateResponse.setFormate(format);
        dateResponse.setIst(dateFormat.format(date));
        dateResponse.setGmt(dateUtils.convertIstToGmt(dateResponse.getIst()));
        return dateResponse;
    }
}
