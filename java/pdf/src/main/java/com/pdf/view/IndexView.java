package com.pdf.view;

import com.pdf.constants.AppConstant;
import io.dropwizard.views.View;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by shishupalkumar on 11/02/17.
 */

public class IndexView extends View {
    private static Logger logger = LoggerFactory.getLogger(IndexView.class);
    private String appVersion;
    public IndexView(HttpServletRequest httpServletRequest) {
        super("index.ftl");
        this.appVersion = AppConstant.AppVersion;
        logger.info("Loading IndexView.");
    }
    public String getAppVersion() {
        return appVersion;
    }
}
