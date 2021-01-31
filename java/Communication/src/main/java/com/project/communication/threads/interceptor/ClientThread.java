package com.project.communication.threads.interceptor;

import com.project.communication.capitalization.CapitalizationClient;
import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.obj.ProtocolConfig;

public class ClientThread extends Thread {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(ClientThread.class);
    private final ProtocolConfig protocolConfig;
    public ClientThread(ProtocolConfig protocolConfig) {
        this.protocolConfig = protocolConfig;
    }
    @Override
    public void run() {
        logger.info("Client thread started.");
        CapitalizationClient.main(protocolConfig);
    }
}
