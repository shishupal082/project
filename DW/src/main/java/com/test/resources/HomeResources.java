package com.test.resources;

import com.test.services.Add;

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
        Integer sum = Add.add(3,4);
        map.put("sum_of_two_number", sum.toString());
        return  map;
    }
}
