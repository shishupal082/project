package com.todo.config;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;

/**
 * Created by shishupalkumar on 18/02/17.
 */
public class ResourceDetails {
    private ArrayList<Resource> resources;

    public ArrayList<Resource> getResources() {
        return resources;
    }

    public void setResources(ArrayList<Resource> resources) {
        this.resources = resources;
    }

    @Override
    public String toString() {
        return "ResourceDetails{" +
            "resources=" + resources +
            '}';
    }
}