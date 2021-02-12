package com.project.communication.serviceV3.common;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppReferenceEnum;
import com.project.communication.serviceV3.ActualClient;
import com.project.communication.serviceV3.FileClient;
import com.project.communication.serviceV3.FileServer;

import java.util.TimerTask;

public class TcpFileReadTimer extends TimerTask {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(TcpFileReadTimer.class);
    private final FileServer fileServer;
    private final FileClient fileClient;
    private final ActualClient actualClient;
    private final ReadInputV2 readInputV2;
    private int count = 0;
    public TcpFileReadTimer(ReadInputV2 ReadInputV2, FileServer fileServer,
                            FileClient fileClient, ActualClient actualClient) {
        this.readInputV2 = ReadInputV2;
        this.fileServer = fileServer;
        this.fileClient = fileClient;
        this.actualClient = actualClient;
    }
    public void run() {
        count++;
//        logger.info("Timer count: " + count);
        AppReferenceEnum reference = readInputV2.getReference();
        if (reference == AppReferenceEnum.ONE && fileServer != null) {
            this.fileServer.receivedData(readInputV2.getByteData());
        } else if (reference == AppReferenceEnum.ZERO && fileClient != null) {
            this.fileClient.receivedData(readInputV2.getByteData());
        } else if (reference == AppReferenceEnum.THREE && actualClient != null) {
            this.actualClient.receivedData(readInputV2.getByteData());
        } else {
            logger.info("Invalid config");
        }
    }
}
