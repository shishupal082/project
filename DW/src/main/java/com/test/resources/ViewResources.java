package com.test.resources;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by shishupal.kumar on 24/12/15.
 */
@Path("/view")
public class ViewResources {
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Map<String, String> getDate(){
        Map<String, String> response = new HashMap<String, String>();
        return  response;
    }
}
