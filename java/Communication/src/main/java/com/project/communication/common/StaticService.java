package com.project.communication.common;

import com.project.communication.config.ApplicationName;

public class StaticService {
    public static ApplicationName getApplicationName(String name) {
        if (name == null) {
            return null;
        }
        name = name.toLowerCase();
        if (ApplicationName.SERVER.getApplicationName().equals(name)) {
            return ApplicationName.SERVER;
        }
        if (ApplicationName.CLIENT.getApplicationName().equals(name)) {
            return ApplicationName.CLIENT;
        }
        if (ApplicationName.INTERCEPTOR.getApplicationName().equals(name)) {
            return ApplicationName.INTERCEPTOR;
        }
        return null;
    }
}
