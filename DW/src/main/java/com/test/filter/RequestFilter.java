package com.test.filter;

import org.slf4j.MDC;

import java.io.IOException;
import java.util.UUID;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;

import lombok.extern.slf4j.Slf4j;

/**
 * Created by shishupal.kumar on 03/02/16.
 */
@Slf4j
public class RequestFilter implements ContainerRequestFilter {
	public RequestFilter(){}

	@Override
	public void filter(final ContainerRequestContext requestContext) throws IOException {
		MDC.remove("X-Transaction-Key");
		MDC.put("X-Transaction-Key", UUID.randomUUID().toString());
		log.error("Request filter start");
	}
}
