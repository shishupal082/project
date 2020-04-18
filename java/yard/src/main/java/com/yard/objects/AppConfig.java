package com.yard.objects;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Created by shishupalkumar on 18/05/17.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class AppConfig {
    private String resourcePath;
    private String indexPageReRoute;

    public String getResourcePath() {
        return resourcePath;
    }

    public void setResourcePath(String resourcePath) {
        this.resourcePath = resourcePath;
    }

    public String getIndexPageReRoute() {
        return indexPageReRoute;
    }

    public void setIndexPageReRoute(String indexPageReRoute) {
        this.indexPageReRoute = indexPageReRoute;
    }

    @Override
    public String toString() {
        return "AppConfig{" +
                "resourcePath='" + resourcePath + '\'' +
                ", indexPageReRoute='" + indexPageReRoute + '\'' +
                '}';
    }
}
