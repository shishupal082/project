package com.yard.objects;

import com.fasterxml.jackson.annotation.JacksonAnnotation;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIgnoreType;

import java.util.Map;

/**
 * Created by shishupalkumar on 11/01/17.
 */
@JsonIgnoreProperties(ignoreUnknown=true)
public class TestConfig {

    private Map<String, String> common;

    public Map<String, String> getCommon() {
        return common;
    }

    public void setCommon(Map<String, String> common) {
        this.common = common;
    }

    @Override
    public String toString() {
        return "TestConfig{" +
                "common=" + common +
                '}';
    }
}
