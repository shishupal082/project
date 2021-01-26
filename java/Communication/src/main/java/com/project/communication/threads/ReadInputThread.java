package com.project.communication.threads;

import com.project.communication.capitalization.CapitalizationClient;
import com.project.communication.capitalization.CapitalizationServer;
import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.service.ReadInput;
import com.project.communication.service.SocketService;

import java.io.InputStream;
import java.net.Socket;
import java.util.Timer;
import java.util.TimerTask;

public class ReadInputThread extends TimerTask {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(CapitalizationServer.class);
    private final CapitalizationClient client;
    private int count = 1;
    public ReadInputThread(CapitalizationClient client) {
        this.client = client;
    }
    public void run() {
        logger.info("Running timer: " + count++);
        client.getResponse();
    }
}
