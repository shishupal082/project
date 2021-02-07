package com.project.communication.threads;

import com.project.communication.capitalization.CapitalizationClient;
import com.project.communication.capitalization.CapitalizationServer;
import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppReference;
import com.project.communication.interceptorTcp.InterceptorServer;
import com.project.communication.obj.ReadInterface;
import com.project.communication.service.ReadInput;
import com.project.communication.threads.interceptor.Interceptor;
import com.project.communication.threads.interceptor.InterceptorClient;

import java.util.TimerTask;

public class ReadCharDataTimer extends TimerTask {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(ReadCharDataTimer.class);
    private final ReadInterface readInterface;
    private final CapitalizationServer capitalizationServer;
    private final CapitalizationClient capitalizationClient;
    private final InterceptorServer interceptorServer;
    private final InterceptorClient interceptorClient;
    private final Interceptor interceptor;
    private final ReadInput readInput;
    private int count = 0;
    public ReadCharDataTimer(ReadInterface readInterface, ReadInput readInput,
                             CapitalizationServer capitalizationServer,
                             CapitalizationClient capitalizationClient,
                             InterceptorServer interceptorServer,
                             InterceptorClient interceptorClient,
                             Interceptor interceptor) {
        this.readInterface = readInterface;
        this.readInput = readInput;
        this.capitalizationServer = capitalizationServer;
        this.capitalizationClient = capitalizationClient;
        this.interceptorServer = interceptorServer;
        this.interceptorClient = interceptorClient;
        this.interceptor = interceptor;
    }
    public void stop() {
        this.readInterface.endReadChar(this);
    }
    public void run() {
        count++;
        AppReference reference = readInput.getReference();
//        logger.info("count: " + count + ":" + reference + ":" + readInput.getByteData());
//        this.readInterface.printData(readInput);
        if (reference == AppReference.ONE && capitalizationServer != null) {
            this.capitalizationServer.receivedData(readInput.getByteData());
        } else if (reference == AppReference.TWO && capitalizationClient != null) {
            this.capitalizationClient.receivedData(readInput.getByteData());
        } else if (reference == AppReference.THREE && interceptorServer != null) {
            this.interceptorServer.receivedData(readInput.getByteData(), interceptorClient, interceptor);
        } else if (reference == AppReference.FOUR && interceptorClient != null) {
            this.interceptorClient.receivedData(readInput.getByteData(), interceptorServer, interceptor);
        }
    }
}
