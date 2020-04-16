package com.yard.domain.view;

import com.yard.constants.AppConstant;
import io.dropwizard.views.View;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;

/**
 * Created by shishupalkumar on 11/02/17.
 */

public class IndexView extends View {
    private static Logger logger = LoggerFactory.getLogger(IndexView.class);
    private String indexPageReRoute;
    private String appVersion;
    public IndexView(HttpServletRequest httpServletRequest, String indexPageReRoute2) {
        super("index.ftl");
        if (indexPageReRoute2 == null) {
            indexPageReRoute2 = "";
        }
        this.indexPageReRoute = indexPageReRoute2;
        this.appVersion = AppConstant.AppVersion;
        logger.info("Loading IndexView.");
    }
    public String getAppVersion() {
        return appVersion;
    }
    public String getIndexPageReRoute() {
        return indexPageReRoute;
    }
}
