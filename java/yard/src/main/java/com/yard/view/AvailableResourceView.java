package com.yard.view;

import com.yard.constants.AppConstant;
import io.dropwizard.views.View;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by shishupalkumar on 11/02/17.
 */
public class AvailableResourceView extends View {
    private static Logger logger = LoggerFactory.getLogger(AvailableResourceView.class);
    private String appVersion;
    public AvailableResourceView(HttpServletRequest httpServletRequest) {
        super("resource.ftl");
        this.appVersion = AppConstant.AppVersion;
        logger.info("Loaded AvailableResourceView.");
    }
    public String getAppVersion() {
        return appVersion;
    }
}
