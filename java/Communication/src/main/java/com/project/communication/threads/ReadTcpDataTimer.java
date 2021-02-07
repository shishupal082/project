package com.project.communication.threads;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppReference;
import com.project.communication.obj.ReadInterface;
import com.project.communication.service.ReadInput;
import com.project.communication.tcp.TcpClient;
import com.project.communication.tcp.TcpServer;

import java.util.TimerTask;

public class ReadTcpDataTimer extends TimerTask {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(ReadTcpDataTimer.class);
    private final ReadInterface readInterface;
    private final TcpServer tcpServer;
    private final TcpClient tcpClient;
    private final ReadInput readInput;
    private int count = 0;
    public ReadTcpDataTimer(ReadInterface readInterface, ReadInput readInput,
                            TcpServer tcpServer, TcpClient tcpClient) {
        this.readInterface = readInterface;
        this.readInput = readInput;
        this.tcpServer = tcpServer;
        this.tcpClient = tcpClient;
    }
    public void stop() {
        this.readInterface.endReadChar(this);
    }
    public void run() {
        count++;
        AppReference reference = readInput.getReference();
//        logger.info("count: " + count + ":" + reference + ":" + readInput.getByteData());
//        this.readInterface.printData(readInput);
        if (reference == AppReference.ONE && tcpServer != null) {
            this.tcpServer.receivedData(readInput.getByteData());
        } else if (reference == AppReference.TWO && tcpClient != null) {
            this.tcpClient.receivedData(readInput.getByteData());
        } else {
            logger.info("invalid reference: " + reference);
        }
    }
}
