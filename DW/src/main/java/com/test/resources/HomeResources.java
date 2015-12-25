package com.test.resources;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by shishupal.kumar on 19/12/15.
 */
@Path("/")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class HomeResources {
    public HomeResources(){}
    @GET
    public Map<String, String> home(){
        Map<String, String> map = new HashMap<String, String>();
        map.put("url", "home");
        return  map;
    }
}
