package com.yard.view;

import com.yard.constants.AppConstant;
import io.dropwizard.views.View;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by shishupalkumar on 11/02/17.
 */
public class S17View extends View {
    private static Logger logger = LoggerFactory.getLogger(S17View.class);
    private String appVersion;
    public S17View(HttpServletRequest httpServletRequest) {
        super("yard-s17.ftl");
        this.appVersion = AppConstant.AppVersion;
        logger.info("Loaded S17View.");
    }
    public String getAppVersion() {
        return appVersion;
    }
}
