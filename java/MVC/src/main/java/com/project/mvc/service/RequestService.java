package com.project.mvc.service;

import javax.servlet.http.HttpServletRequest;

public class RequestService {
    public String getPathUrl(final HttpServletRequest request) {
        String path = request.getPathInfo();
        String[] pathArr = path.split("\\?");
        if (pathArr.length > 0) {
            path = pathArr[0];
        }
        return path;
    }
}
