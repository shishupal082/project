package com.todo.domain.view;

import io.dropwizard.views.View;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by shishupalkumar on 11/02/17.
 */
public class TodoView extends View{
    public TodoView(HttpServletRequest httpServletRequest) {
        super("todo.ftl");
    }
}
