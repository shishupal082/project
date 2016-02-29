package com.test.resources;

import com.test.filter.RequestFilter;

import java.util.HashMap;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

/**
 * Created by shishupal.kumar on 03/02/16.
 */
@Path("/data")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class DataResource {
	private RequestFilter requestFilter;
	public DataResource(RequestFilter requestFilter){
		requestFilter = requestFilter;
	}
	@GET
	@Path("/str_to_array")
	public Map<String, String> home(){
		String data = "{\"name\":\"shishupal\",\"data\":\"{\"name\":\"shishupal\"}\"}\"";
		Map<String, String> map = new HashMap<String, String>();
		map.put("details", data);
		return  map;
	}
}
