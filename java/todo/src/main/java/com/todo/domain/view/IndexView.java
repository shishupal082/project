package com.todo.domain.view;

import com.todo.yaml.todo.Resource;
import com.todo.yaml.todo.ResourceDetails;
import com.todo.constants.AppConstant;
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
    private ResourceDetails resourceDetails;
    private String indexPageReRoute;
    private String appVersion;
    public IndexView(HttpServletRequest httpServletRequest, ResourceDetails resourceDetails,
                     String indexPageReRoute2) {
        super("index.ftl");
        this.resourceDetails = resourceDetails;
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

    public ArrayList<Resource> getResourceDetails() {
        return resourceDetails.getResources();
    }
}
