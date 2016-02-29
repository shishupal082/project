package com.test.filter;

import com.test.utils.Utils;

import java.io.IOException;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;

import lombok.Getter;
import lombok.Setter;

/**
 * Created by shishupal.kumar on 03/02/16.
 */
@Getter
@Setter
public class RequestFilter implements ContainerRequestFilter {
	private String requestId;
	public RequestFilter(){
		requestId = Utils.getRandomNumber();
	}

	public void logInfo(String string){
		System.out.println(requestId + " : " + string);
	}

	@Override
	public void filter(final ContainerRequestContext requestContext) throws IOException {
		System.out.println("Request filter start");
	}
}
