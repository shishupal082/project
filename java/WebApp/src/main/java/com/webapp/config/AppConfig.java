package com.webapp.config;

public class AppConfig {
    private String publicDir;

    public String getPublicDir() {
        return publicDir;
    }

    public void setPublicDir(String publicDir) {
        this.publicDir = publicDir;
    }

    @Override
    public String toString() {
        return "AppConfig{" +
                "publicDir='" + publicDir + '\'' +
                '}';
    }
}
