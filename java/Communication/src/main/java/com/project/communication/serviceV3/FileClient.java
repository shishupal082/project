package com.project.communication.serviceV3;// package socketClient;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.common.SysUtils;
import com.project.communication.config.AppConstant;
import com.project.communication.config.AppReferenceEnum;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.service.SocketService;
import com.project.communication.serviceV3.common.ReadInputV2;

import java.io.DataOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.Socket;

/**
 * Created by shishupalkumar on 12/08/16.
 */
public class FileClient implements Runnable {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(FileClient.class);
    private final ProtocolConfig protocolConfig;
    private final Socket socket;
    private final ReadInputV2 readInputV2;
    private final SysUtils sysUtils = new SysUtils();
    private int outCount = 0;
    private FileClient(ProtocolConfig protocolConfig, Socket socket) {
        this.protocolConfig = protocolConfig;
        this.socket = socket;
        this.readInputV2 = new ReadInputV2(0, AppReferenceEnum.ZERO, protocolConfig);
    }
    public void receivedData(String byteData) {
        if (byteData == null || byteData.length() < 1) {
            return;
        }
        logger.info("Received data: " + byteData);
        readInputV2.resetByteData();
    }
    private void sendRequest(String request) {
        outCount++;
        logger.info("Sending Request count: " + outCount +  " :" + request);
        readInputV2.sendData(socket, request);
    }
    public void run() {
        logger.info("Enter string: ");
        String input = "";
        do {
            input = sysUtils.readCommandLine();
            logger.info("input: " + input);
            sendRequest(input);
        } while (!input.equals("bye"));
        readInputV2.stopTimer();
        SocketService.close(0, socket);
    }
    public static void main(ProtocolConfig protocolConfig) {
        String ip = protocolConfig.getServerIp();
        int port = protocolConfig.getServerPort();
        try {
            Socket socket = new Socket();
            socket.connect(new InetSocketAddress(ip, port), 10000);
            FileClient client = new FileClient(protocolConfig, socket);
            Thread thread = new Thread(client);
            thread.start();
            client.readInputV2.readBytes(socket.getInputStream(), null, client);
        } catch (Exception e) {
            logger.info("Socket output : " + e.getMessage());
        }
    }
}
