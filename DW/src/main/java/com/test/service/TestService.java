package com.test.service;

import com.test.domain.Todo.Todo;
import com.test.domain.UserAgentInfo;
import com.test.domain.test.DateResponse;
import com.test.utils.DateUtils;
import com.test.utils.UserAgentUtils;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

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
    public List<Todo> getTodos(){
        List<Todo> todos = new ArrayList<Todo>();
        todos.add(new Todo());
        return todos;
    }

    public UserAgentInfo getUserAgentInfo(final HttpServletRequest httpServletRequest){
        UserAgentInfo userAgentInfo = UserAgentUtils.getUserAgent(httpServletRequest);
        return userAgentInfo;
    }
}
