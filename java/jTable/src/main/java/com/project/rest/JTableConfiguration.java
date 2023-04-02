package com.project.rest;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.dropwizard.Configuration;

@JsonIgnoreProperties(ignoreUnknown = true)

public class JTableConfiguration extends Configuration {

}
