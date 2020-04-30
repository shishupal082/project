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
    private PathInfo getPathInfo(String requestedPath) {
        requestedPath = webAppConfig.getAppConfig().getPublicDir() + requestedPath;
        PathInfo pathInfo = new PathInfo(requestedPath);
        File file = new File(requestedPath);
        if (file.isDirectory()) {
            pathInfo.setType(AppConstant.FOLDER);
        } else if(file.isFile()) {
            pathInfo.setType(AppConstant.FILE);
            pathInfo.setFileName(file.getName());
        }
        return pathInfo;
    }
    private void searchIndexHtmlInFolder(PathInfo pathInfo) {
        if (AppConstant.FOLDER.equals(pathInfo.getType())) {
            File file1 = new File(pathInfo.getPath() + "index.html");
            File file2 = new File(pathInfo.getPath() + "/index.html");
            File file = null;
            if (file1.isFile()) {
                file = file1;
            } else if (file2.isFile()) {
                file = file2;
            }
            if (file != null) {
                String pre = pathInfo.toString();
                pathInfo.setPath(file.getPath());
                pathInfo.setType(AppConstant.FILE);
                pathInfo.setFileName(file.getName());
                logger.info("PathInfo changes from folder to file: {} to {}", pre, pathInfo.toString());
            }
        }
    }
    public PathInfo getFileResponse(final String requestedPath) {
        PathInfo pathInfo = getPathInfo(requestedPath);
        if (AppConstant.FOLDER.equals(pathInfo.getType())) {
            searchIndexHtmlInFolder(pathInfo);
        }
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
