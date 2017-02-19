package com.todo.domain.view;

import com.todo.resources.TodoResource;
import io.dropwizard.views.View;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by shishupalkumar on 11/02/17.
 */
public class CommonView extends View {
    private static Logger logger = LoggerFactory.getLogger(CommonView.class);
    public CommonView(HttpServletRequest httpServletRequest, String pageName) {
        super(pageName);
        logger.info("Loading CommonView with page : {}", pageName);
    }
}
