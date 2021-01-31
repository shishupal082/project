package com.project.communication.threads.interceptor;

import com.project.communication.capitalization.CapitalizationServer;
import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.obj.ProtocolConfig;

public class ServerThread extends Thread {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(ServerThread.class);
    private final ProtocolConfig protocolConfig;
    public ServerThread(ProtocolConfig protocolConfig) {
        this.protocolConfig = protocolConfig;
    }

    @Override
    public void run() {
        logger.info("Server thread started.");
        CapitalizationServer.main(protocolConfig);
    }
}
