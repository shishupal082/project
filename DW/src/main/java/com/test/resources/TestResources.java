package com.test.resources;

import com.test.config.TestConfig;
import com.test.domain.test.DateResponse;
import com.test.service.TestService;
import org.apache.log4j.Logger;
import org.apache.log4j.spi.LoggerFactory;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.HashMap;
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
}
