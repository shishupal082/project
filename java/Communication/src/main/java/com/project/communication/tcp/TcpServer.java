package com.project.communication.tcp;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppConstant;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.service.ReadInput;
import com.project.communication.threads.TcpServerThread;

import java.io.DataOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;

public class TcpServer {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(TcpServer.class);
    private final ProtocolConfig protocolConfig;
    private final ReadInput readInput;
    private final int clientId;
    private final Socket socket;
    public TcpServer(ProtocolConfig protocolConfig, ReadInput readInput, Socket socket) {
        this.protocolConfig = protocolConfig;
        this.readInput = readInput;
        this.clientId = readInput.getClientId();
        this.socket = socket;
    }
    public void receivedData(String byteData) {
        if (byteData == null || byteData.length() < 1) {
            return;
        }
        logger.info(clientId + ": Received data as below:");
        logger.infoDirect(byteData);
        readInput.resetByteData();
//        this.sendResponse(byteData);
    }
    public void sendResponse(String byteData) {
        if (byteData == null || byteData.length() < 1) {
            return;
        }
        logger.info("Generating response for: " + byteData);
        try {
            String response = byteData.toUpperCase();
            logger.info(clientId + ": Sending Response: " + response);
            OutputStream outToServer = socket.getOutputStream();
            DataOutputStream dataOutputStream = new DataOutputStream(outToServer);
            dataOutputStream.writeInt(233);
            dataOutputStream.writeInt(256);
            dataOutputStream.write(response.getBytes(AppConstant.UTF_8));
            dataOutputStream.flush();
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
            logger.info("TcpServer is running on port: " + port);
            clientNumber++;
            Socket socket = serverSocket.accept();
            logger.info(clientNumber+": New client connected");
            new TcpServerThread(protocolConfig, clientNumber, socket).start();
        } catch (Exception e) {
            logger.info("Error in capitalize");
        }
    }
}
