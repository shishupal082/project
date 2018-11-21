package com.todo.domain.view;

import com.todo.config.Resource;
import com.todo.config.ResourceDetails;
import com.todo.resources.TodoResource;
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
    public IndexView(HttpServletRequest httpServletRequest, ResourceDetails resourceDetails,
                     String indexPageReRoute) {
        super("index.ftl");
        this.resourceDetails = resourceDetails;
        if (indexPageReRoute == null) {
            indexPageReRoute = "";
        }
        this.indexPageReRoute = indexPageReRoute;
        logger.info("Loading IndexView.");
    }

    public String getIndexPageReRoute() {
        return indexPageReRoute;
    }

    public ArrayList<Resource> getResourceDetails() {
        return resourceDetails.getResources();
    }
}
