package com.project.communication.obj;

import com.project.communication.capitalization.CapitalizationClient;
import com.project.communication.capitalization.CapitalizationServer;
import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.service.ReadInput;

import java.util.TimerTask;

public class ReadCharDataTimer extends TimerTask {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(ReadCharDataTimer.class);
    private final ReadInterface readInterface;
    private final CapitalizationServer capitalizationServer;
    private final CapitalizationClient capitalizationClient;
    private final int reference;
    private int count = 0;
    public ReadCharDataTimer(ReadInterface readInterface, int reference,
                             CapitalizationServer capitalizationServer,
                             CapitalizationClient capitalizationClient) {
        this.readInterface = readInterface;
        this.reference = reference;
        this.capitalizationServer = capitalizationServer;
        this.capitalizationClient = capitalizationClient;
    }
    public void stop() {
        this.readInterface.endReadChar(this);
    }
    public void run() {
        count++;
//        logger.info("count: " + count + ":" + reference + ":" + ReadInput.getByteData());
//        this.readInterface.printData();
        if (reference == 1 && capitalizationServer != null) {
            this.capitalizationServer.receivedData(ReadInput.getByteData());
        } else if (reference == 2 && capitalizationClient != null) {
            this.capitalizationClient.receivedData(ReadInput.getByteData());
        }
    }
}
