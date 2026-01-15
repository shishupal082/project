package com.roles_mapping.service;

import com.roles_mapping.annotation.version;
import com.roles_mapping.config.BridgeConstant;

public class AnnotationService {
    public AnnotationService() {}
    public static <T> String getAppVersion(Class<T> clazz, String defaultData) {
        // Check if the annotation is present
        if (clazz.isAnnotationPresent(version.class)) {
            // Retrieve the specific annotation
            version annotation = clazz.getAnnotation(version.class);
            return annotation.app_version();
        }
        return defaultData;
    }
    public static <T> String getAppVersion(Class<T> clazz) {
        return AnnotationService.getAppVersion(clazz, BridgeConstant.NULL_STR);
    }
}
