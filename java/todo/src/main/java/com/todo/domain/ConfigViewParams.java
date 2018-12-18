package com.todo.domain;

import java.util.ArrayList;

/**
 * Created by shishupalkumar on 19/02/17.
 */
public class ConfigViewParams {
    private String title;
    private String heading;
    private ArrayList<String> files;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getHeading() {
        return heading;
    }

    public void setHeading(String heading) {
        this.heading = heading;
    }

    public ArrayList<String> getFiles() {
        return files;
    }

    public void setFiles(ArrayList<String> files) {
        this.files = files;
    }

    @Override
    public String toString() {
        return "ConfigViewParams{" +
            "title='" + title + '\'' +
            ", heading='" + heading + '\'' +
            ", files=" + files +
            '}';
    }
}
