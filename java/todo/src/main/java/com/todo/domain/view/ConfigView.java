package com.todo.domain.view;

import com.todo.TodoConfiguration;
import com.todo.domain.ConfigDetails;
import com.todo.domain.ConfigViewParams;
import io.dropwizard.views.View;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Map;

/**
 * Created by shishupalkumar on 19/02/17.
 */
public class ConfigView extends View {
    private ConfigViewParams configViewParams;
    private static Logger logger = LoggerFactory.getLogger(ConfigView.class);
    public ConfigView(HttpServletRequest httpServletRequest, TodoConfiguration todoConfiguration, String pageName) {
        super(pageName);
        logger.info("Loading CommonView with page : {}", pageName);
        configViewParams = new ConfigViewParams();
        configViewParams.setHeading("Config View");
        configViewParams.setTitle("Config Dashboard");
        ConfigDetails configDetails = new ConfigDetails(todoConfiguration);
        configViewParams.setFiles(configDetails.getConfigFiles());
    }
    public ConfigViewParams getConfigViewParams() {
        return configViewParams;
    }
}
