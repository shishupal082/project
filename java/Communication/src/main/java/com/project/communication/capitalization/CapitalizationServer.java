package com.project.communication.capitalization;// package socketServer;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppConstant;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.service.ReadInput;
import com.project.communication.threads.ServerThreadV2;

import java.io.DataOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;

/**
 * Created by shishupalkumar on 12/08/16.
 */

public class CapitalizationServer {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(CapitalizationServer.class);
    private final ProtocolConfig protocolConfig;
    private final ReadInput readInput;
    private final int clientId;
    private final Socket socket;
    public CapitalizationServer(ProtocolConfig protocolConfig, ReadInput readInput, Socket socket) {
        this.protocolConfig = protocolConfig;
        this.readInput = readInput;
        this.clientId = readInput.getClientId();
        this.socket = socket;
    }
    public void receivedData(String byteData) {
        if (byteData == null || byteData.length() < 1) {
            return;
        }
        logger.info(clientId + ": Received data: " + byteData);
        this.sendResponse(byteData);
    }
    public void sendResponse(String byteData) {
        if (byteData == null || byteData.length() < 1) {
            return;
        }
        try {
            String response = byteData.toUpperCase();
            logger.info(clientId + ": Sending Response: " + response);
            OutputStream outToServer = socket.getOutputStream();
            DataOutputStream dataOutputStream = new DataOutputStream(outToServer);
            dataOutputStream.write(response.getBytes(AppConstant.UTF_8));
            readInput.resetByteData();
        } catch (IOException e) {
            logger.info("Error in sending data");
        }
    }
    public static void main(ProtocolConfig protocolConfig) {
        int port = protocolConfig.getClientPort();
        int clientNumber = 0;
        try {
            ServerSocket serverSocket = new ServerSocket(port);
            logger.info("Capitalization server is running on port: " + port);
            clientNumber++;
            Socket socket = serverSocket.accept();
            logger.info(clientNumber+": New client connected");
            new ServerThreadV2(protocolConfig, clientNumber, socket).start();
        } catch (Exception e) {
            logger.info("Error in capitalize");
        }
    }
}
