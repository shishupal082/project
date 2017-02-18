package com.todo.domain;

/**
 * Created by shishupalkumar on 18/02/17.
 */
public class DashboradParams {
    private String title;
    private String heading;

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

    @Override
    public String toString() {
        return "DashboradParams{" +
            "title='" + title + '\'' +
            ", heading='" + heading + '\'' +
            '}';
    }
}
