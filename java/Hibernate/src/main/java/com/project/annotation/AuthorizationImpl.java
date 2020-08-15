package com.project.annotation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class AuthorizationImpl {
    private static final Logger logger = LoggerFactory.getLogger(AuthorizationImpl.class);

    public boolean authorize(String token) {
        // implemnt jwt or any any token based authorization logic
        logger.info("Authorize access");
        return true;
    }
}