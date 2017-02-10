package com.todo.domain.view;

import io.dropwizard.views.View;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by shishupalkumar on 04/02/17.
 */
public class DashboardView extends View {
    public DashboardView(HttpServletRequest httpServletRequest) {
        super("dashboard.ftl");
    }
}
