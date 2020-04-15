package com.yard.resources;

import com.yard.YardConfiguration;
import com.yard.domain.view.AvailableResourceView;
import com.yard.domain.view.CommonView;
import com.yard.domain.view.S17View;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import java.net.URISyntaxException;

/**
 * Created by shishupalkumar on 04/02/17.
 */

@Path("/")
@Produces(MediaType.TEXT_HTML)
@Consumes(MediaType.APPLICATION_JSON)
public class ViewResource {
    private static Logger logger = LoggerFactory.getLogger(ViewResource.class);
    @Context
    private HttpServletRequest httpServletRequest;
    private YardConfiguration yardConfiguration;
    public ViewResource(YardConfiguration yardConfiguration) {
        this.yardConfiguration = yardConfiguration;
    }
    @GET
    public S17View indexPage() {
        logger.info("Loading: S17View");
        return new S17View(httpServletRequest);
    }
    @GET
    @Path("/resource")
    public AvailableResourceView getIndex() throws URISyntaxException {
        logger.info("Loading: AvailableResourceView");
        return new AvailableResourceView(httpServletRequest);
    }
    @Path("{default: .*}")
    @GET
    public CommonView defaultMethod() throws URISyntaxException {
        logger.info("Loading: defaultMethod: page_not_found_404");
        return new CommonView(httpServletRequest, "page_not_found_404.ftl");
    }
}
