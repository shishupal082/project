package com.project.communication.capitalization;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.threads.ServerThreadV2;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

public class MultiThreadedCapitalizationServer {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(MultiThreadedCapitalizationServer.class);
    public static void main(ProtocolConfig protocolConfig) {
        int port = protocolConfig.getClientPort();
        int clientId = 0;
        try (ServerSocket serverSocket = new ServerSocket(port)) {
            logger.info("Server is listening on port " + port);
            while (true) {
                clientId++;
                Socket socket = serverSocket.accept();
                logger.info(clientId+": New client connected");
                new ServerThreadV2(protocolConfig, clientId, socket).start();
            }
        } catch (IOException ex) {
            logger.info("Server exception: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}
