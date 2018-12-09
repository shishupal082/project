package com.todo.yaml.todo;

import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Path {
    private String name;
    private ArrayList<ArrayList<String>> details;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ArrayList<ArrayList<String>> getDetails() {
        return details;
    }

    public void setDetails(ArrayList<ArrayList<String>> details) {
        this.details = details;
    }

    @Override
    public String toString() {
        return "Path{" +
                "name='" + name + '\'' +
                ", details=" + details +
                '}';
    }
}
