package com.project.communication.interceptorTcp;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppConstant;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.threads.interceptor.Interceptor;
import com.project.communication.threads.interceptor.InterceptorTimer;

import java.util.Timer;

public class TransferRequest {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(TransferRequest.class);
    public static void main(ProtocolConfig protocolConfig) {
//        new Interceptor(protocolConfig, AppConstant.appNameClient).start();
//        new Interceptor(protocolConfig, AppConstant.appNameServer).start();
        Timer timer = new Timer();
        InterceptorTimer interceptorTimer = new InterceptorTimer(protocolConfig, timer, AppConstant.appNameServer);
        timer.schedule(interceptorTimer, 0, 1000);
        new Interceptor(protocolConfig, AppConstant.appNameClient).start();
        Timer timer2 = new Timer();
        InterceptorTimer interceptorTimer2 = new InterceptorTimer(protocolConfig, timer, AppConstant.appNameClient);
        timer.schedule(interceptorTimer2, 0, 1000);
    }
}
