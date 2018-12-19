package com.todo.yaml.todo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Created by shishupalkumar on 18/02/17.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Resource {
    private String url;
    private String name;
    private String help;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getHelp() {
        return help;
    }

    public void setHelp(String help) {
        this.help = help;
    }

    @Override
    public String toString() {
        return "Resource{" +
            "url='" + url + '\'' +
            ", name='" + name + '\'' +
            ", help='" + help + '\'' +
            '}';
    }
}
