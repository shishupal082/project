package com.webapp.service;

import com.webapp.config.WebAppConfig;
import com.webapp.constants.AppConstant;
import com.webapp.obj.PathInfo;
import org.eclipse.jetty.server.Request;
import org.glassfish.jersey.server.ContainerRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.container.ContainerRequestContext;
import java.io.File;

public class FileService {
    private static Logger logger = LoggerFactory.getLogger(FileService.class);
    private WebAppConfig webAppConfig;
    public FileService(final WebAppConfig webAppConfig) {
        this.webAppConfig = webAppConfig;
    }
    private PathInfo getPathInfo(String filePath) {
        PathInfo pathInfo = new PathInfo(filePath);
        filePath = webAppConfig.getAppConfig().getPublicDir() + filePath;
        File file = new File(filePath);
        if (file.isDirectory()) {
            pathInfo.setType(AppConstant.FOLDER);
            pathInfo.setFilePath(filePath);
        } else if(file.isFile()) {
            pathInfo.setType(AppConstant.FILE);
            pathInfo.setFilePath(filePath);
        }
        return pathInfo;
    }
    public PathInfo getFileResponse(final String requestedPath) {
        PathInfo pathInfo = getPathInfo(requestedPath);
        pathInfo.findExtention();
        pathInfo.findMimeType(webAppConfig);
        logger.info("PathDetails: {}", pathInfo.toString());
        return pathInfo;
    }
    public static String getPathUrl(final HttpServletRequest request) {
        String path = ((Request) request).getUri().toString();
        String[] pathArr = path.split("\\?");
        if (pathArr.length > 0) {
            path = pathArr[0];
        }
        return path;
    }
    public static String getPathUrlV2(final ContainerRequestContext requestContext) {
        String path = ((ContainerRequest) requestContext).getPath(true);
        String[] pathArr = path.split("\\?");
        if (pathArr.length > 0) {
            path = pathArr[0];
        }
        return path;
    }
}
