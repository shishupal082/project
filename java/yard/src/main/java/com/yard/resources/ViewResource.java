package com.yard.resources;

import com.yard.YardConfiguration;
import com.yard.view.AvailableResourceView;
import com.yard.view.CommonView;
import com.yard.view.IndexView;
import com.yard.view.S17View;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
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
    public IndexView indexPage() {
        logger.info("Loading: S17View");
        String indexPageReRoute = yardConfiguration.getIndexPageReRoute();
        return new IndexView(httpServletRequest, indexPageReRoute);
    }
    @GET
    @Path("/resource")
    public AvailableResourceView getIndex() throws URISyntaxException {
        logger.info("Loading: AvailableResourceView");
        return new AvailableResourceView(httpServletRequest);
    }
    @GET
    @Path("/yard-s17")
    public S17View yardS17() throws URISyntaxException {
        logger.info("Loading: S17View");
        return new S17View(httpServletRequest);
    }
    @GET
    @Path("/yard-1")
    public CommonView yardOne() throws URISyntaxException {
        logger.info("Loading: CommonView:yardOne yard-1");
        String pageName = "yard-1.ftl";
        return new CommonView(httpServletRequest, pageName);
    }
    @Path("{default: .*}")
    @GET
    public CommonView defaultMethod() throws URISyntaxException {
        logger.info("Loading: CommonView:defaultMethod: page_not_found_404");
        String pageName = "page_not_found_404.ftl";
        return new CommonView(httpServletRequest, "page_not_found_404.ftl");
    }
}
