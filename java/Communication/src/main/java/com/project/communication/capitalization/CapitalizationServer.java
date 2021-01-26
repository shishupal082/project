package com.project.communication.capitalization;// package socketServer;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppConstant;
import com.project.communication.obj.ProtocolConfig;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Date;
import java.util.StringTokenizer;

/**
 * Created by shishupalkumar on 12/08/16.
 */

public class CapitalizationServer {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(CapitalizationServer.class);
    public static void main(ProtocolConfig protocolConfig) {
        int port = protocolConfig.getClientPort();
        int clientId = 0;
        try {
            clientId++;
            ServerSocket serverSocket = new ServerSocket(port);
            logger.info("Capitalization server is running on port: " + port);
            Socket socket = serverSocket.accept();
            logger.info(clientId+": New client connected");
            new Capitalize(protocolConfig, clientId, socket).start();
        } catch (Exception e) {
            logger.info("Error in capitalize");
        }
    }
}
