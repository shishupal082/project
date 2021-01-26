package com.project.communication.capitalization;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.obj.ProtocolConfig;

import java.net.ServerSocket;
import java.net.Socket;
public class SingleThreadedCapitalizationServer {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(SingleThreadedCapitalizationServer.class);
    public static void main(ProtocolConfig protocolConfig) {
        int port = protocolConfig.getClientPort();
        int clientId = 0;
        try {
            clientId++;
            ServerSocket serverSocket = new ServerSocket(port);
            logger.info("Server is listening on port: "+port);
            Socket socket = serverSocket.accept();
            logger.info(clientId + ": New client connected");
            new ServerProgram(protocolConfig, clientId, socket).start();
        } catch (Exception ex) {
            logger.info(clientId + ": Server exception: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}
