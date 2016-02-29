package com.test.resources;

import com.test.config.TestConfig;
import com.test.domain.Todo.Todo;
import com.test.domain.test.DateRequest;
import com.test.domain.test.DateResponse;
import com.test.service.TestService;
import org.apache.log4j.Logger;
import org.apache.log4j.spi.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import java.util.HashMap;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;


/**
 * Created by shishupal.kumar on 19/12/15.
 */
@Path("/test")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TestResources {
    private TestConfig testConfig;
    private TestService testService = new TestService();
    public TestResources(TestConfig testConfig) {
        this.testConfig = testConfig;
    }
    private static final Logger logger = Logger.getLogger(TestResources.class);
    @Path("/getConfig")
    @GET
    public Map<String, String> getConfig(){
        Map<String, String> map = new HashMap<String, String>();
        map.put("configName", this.testConfig.getCommon().get("configName"));
        return  map;
    }
    @Path("/date")
    @GET
    public DateResponse getDate(){
        logger.info("DateResponse getDate");
        DateResponse dateResponse = testService.getCurrentDate();
        return  dateResponse;
    }
    @Path("/date/post")
    @POST
    public DateResponse getDateFromPost(@Context final HttpServletRequest request, final DateRequest dateRequest){
        DateResponse dateResponse = testService.getCurrentDate();
        return  dateResponse;
    }
    @Path("/getTodos")
    @GET
    public List<Todo> getTodos(){
        logger.info("getTodos");
        List<Todo> Todos = testService.getTodos();
        return  Todos;
    }
}
