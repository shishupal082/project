package com.test.resources;

import com.test.TestConfiguration;
import com.test.config.TestConfig;

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
    public TestResources(TestConfig testConfig) {
        this.testConfig = testConfig;
    }
    @Path("/getConfig")
    @GET
    public Map<String, String> getConfig(){
        Map<String, String> map = new HashMap<String, String>();
        map.put("configName", this.testConfig.getCommon().get("configName"));
        return  map;
    }
}
