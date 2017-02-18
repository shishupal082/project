package com.todo.file.domain;

/**
 * Created by shishupalkumar on 18/02/17.
 */
public enum PathType {
    FILE("file"),
    FOLDER("folder");

    private String pathType;

    PathType(String pathType) {
        this.pathType = pathType;
    }

    public String getPathType() {
        return pathType;
    }

    public void setPathType(String pathType) {
        this.pathType = pathType;
    }
}
