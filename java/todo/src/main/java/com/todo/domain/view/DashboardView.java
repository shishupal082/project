package com.todo.domain.view;

import com.todo.domain.DashboradParams;
import io.dropwizard.views.View;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by shishupalkumar on 04/02/17.
 */
public class DashboardView extends View {
    private DashboradParams dashboradParams;
    public DashboardView(HttpServletRequest httpServletRequest) {
        super("dashboard.ftl");
        dashboradParams = new DashboradParams();
        dashboradParams.setHeading("Dashboard View");
        dashboradParams.setTitle("Todo Dashboard");
    }
    public DashboradParams getDashboradParams() {
        return dashboradParams;
    }
}
