package com.project.communication.threads.interceptor;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppConstant;
import com.project.communication.obj.ProtocolConfig;

import java.util.Timer;
import java.util.TimerTask;

public class InterceptorTimer extends TimerTask {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(InterceptorTimer.class);
    private int timerCount = 0;
    private ProtocolConfig protocolConfig;
    private Timer timer;
    private final String name;
    public InterceptorTimer(ProtocolConfig protocolConfig, Timer timer, String name) {
        this.protocolConfig = protocolConfig;
        this.timer = timer;
        this.name = name;
    }
    private void stopTimer() {
        if (this.timer != null) {
            logger.info("Timer canceled: " + name);
            timer.cancel();
        }
    }
    @Override
    public void run() {
        this.timerCount++;
        logger.info("timer count: " + timerCount);
        if (timerCount == 4 && AppConstant.appNameServer.equals(name)) {
            logger.info("Starting server");
            this.stopTimer();
            new Interceptor(protocolConfig, AppConstant.appNameServer).start();
        }
        if (timerCount == 8 && AppConstant.appNameClient.equals(name)) {
            logger.info("Starting client");
            this.stopTimer();
//            new Interceptor(protocolConfig, AppConstant.appNameClient).start();
        }
        if (timerCount > 8) {
            this.stopTimer();
        }
    }
}
