package com.project.ftp.service;

import com.project.ftp.common.DateUtilities;
import com.project.ftp.common.StrUtils;
import com.project.ftp.config.AppConfig;
import com.project.ftp.config.FileMimeType;
import com.project.ftp.obj.PathInfo;
import com.project.ftp.session.SessionService;
import org.eclipse.jetty.server.Request;
import org.glassfish.jersey.server.ContainerRequest;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.container.ContainerRequestContext;

public class StaticService {
    public static PathInfo getPathDetails(String requestedPath) {
        FileService fileService = new FileService();
        return fileService.getPathInfo(requestedPath);
    }
    public static void initApplication(final AppConfig appConfig) {
        ConfigService configService = new ConfigService(appConfig);
        configService.setPublicDir();
    }
    public static String getDateFromInMs(String format, Long timeInMs) {
        DateUtilities dateUtilities = new DateUtilities();
        return dateUtilities.getDateFromInMs(format, timeInMs);
    }
    public static String updateSessionId(AppConfig appConfig, String cookieData) {
        SessionService sessionService = new SessionService(appConfig);
        return sessionService.updateSessionId(cookieData);
    }
    public static String replaceLast(String find, String replace, String str) {
        StrUtils strUtils = new StrUtils();
        return strUtils.replaceLast(find, replace, str);
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
    public static String getFileMimeTypeValue(String name) {
        String response = null;
        FileMimeType fileMimeType;
        try {
            fileMimeType = FileMimeType.valueOf(name);
            response = fileMimeType.getFileMimeType();
        } catch (Exception e) {
//            logger.info("Error in parsing enum ({}): {}", name, e.getMessage());
        }
        return response;
    }
}
