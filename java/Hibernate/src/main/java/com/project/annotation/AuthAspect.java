package com.project.annotation;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import javax.servlet.http.HttpServletRequest;

@Aspect
@Configuration
public class AuthAspect {
    private static final Logger logger = LoggerFactory.getLogger(AuthAspect.class);
    @Autowired
    AuthorizationImpl authBean;

    @Before("@annotation(com.project.annotation.Authorized) && args(request,..)")
    public void before(HttpServletRequest request){
        if (request == null) {
            logger.info("Before: ********** fail");
            return;
//            throw new RuntimeException("request should be HttpServletRequesttype");
        }
        logger.info("before access");
        if(authBean.authorize(request.getHeader("Authorization"))){
            request.setAttribute(
                    "userSession",
                    "session information which cann be access in controller"
            );
        }else {
            throw new RuntimeException("auth error..!!!");
        }

    }

}