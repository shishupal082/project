package com.webapp.config;

import java.util.Map;

/**
 * Created by shishupalkumar on 12/05/17.
 */
public class DirectoryConfig {
    private Map<String, String> mimeType;
    public Map<String, String> getMimeType() {
        return mimeType;
    }

    public void setMimeType(Map<String, String> mimeType) {
        this.mimeType = mimeType;
    }

    @Override
    public String toString() {
        return "DirectoryConfig{" +
                "mimeType=" + mimeType +
                '}';
    }
}
