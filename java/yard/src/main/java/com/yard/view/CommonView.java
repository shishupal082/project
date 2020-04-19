package com.yard.view;

import com.yard.constants.AppConstant;
import io.dropwizard.views.View;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by shishupalkumar on 11/02/17.
 */
public class CommonView extends View {
    private static Logger logger = LoggerFactory.getLogger(CommonView.class);
    private String appVersion;
    public CommonView(HttpServletRequest httpServletRequest, String pageName) {
        super(pageName);
        this.appVersion = AppConstant.AppVersion;
        logger.info("Loaded CommonView with page : {}", pageName);
    }
    public String getAppVersion() {
        return appVersion;
    }
}
