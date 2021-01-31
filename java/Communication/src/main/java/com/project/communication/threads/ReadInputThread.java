package com.project.communication.threads;

import com.project.communication.capitalization.CapitalizationClient;
import com.project.communication.capitalization.CapitalizationServer;
import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;

import java.util.TimerTask;

public class ReadInputThread extends TimerTask {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(CapitalizationServer.class);
    private final CapitalizationClient client;
    private int nullResponseCount = 0;
    public ReadInputThread(CapitalizationClient client) {
        this.client = client;
    }
    public void run() {
        String response = "";
        if (nullResponseCount > 5) {
            this.cancel();
            logger.info("Finding null input");
        } else {
//            response = client.getResponse();
        }
        if (response == null) {
            nullResponseCount++;
        }
    }
}
