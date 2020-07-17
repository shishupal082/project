package com.project.ftp.service;

import com.project.ftp.config.AppConfig;
import com.project.ftp.obj.PathInfo;

public class StaticService {
    public static PathInfo getPathDetails(String requestedPath) {
        FileService fileService = new FileService();
        return fileService.getPathInfo(requestedPath);
    }
    public static void initApplication(final AppConfig appConfig) {
        ConfigService configService = new ConfigService(appConfig);
        configService.setPublicDir();
    }
}
