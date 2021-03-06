package com.project;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.dropwizard.Configuration;
import io.dropwizard.db.DataSourceFactory;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@JsonIgnoreProperties(ignoreUnknown = true)


public class AppConfiguration extends Configuration {
    @NotNull
    @Valid
    @JsonProperty("database")
    private DataSourceFactory dataSourceFactory = new DataSourceFactory();

    public DataSourceFactory getDataSourceFactory() {
        return dataSourceFactory;
    }
    public void setDataSourceFactory(DataSourceFactory dataSourceFactory) {
        this.dataSourceFactory = dataSourceFactory;
    }
}
