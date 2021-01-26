package com.project.communication.time;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.service.SendOutput;

import java.io.IOException;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Date;
public class TimeServer {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(TimeServer.class);
    public static void main(ProtocolConfig protocolConfig) {
        int port = protocolConfig.getClientPort();
        int clientId = 0;
        try (ServerSocket serverSocket = new ServerSocket(port)) {
            logger.info("Time Server is listening on port " + port);
            while (true) {
                clientId++;
                Socket socket = serverSocket.accept();
                logger.info(clientId+": New client connected");
                OutputStream outputStream = socket.getOutputStream();
                SendOutput.sendLine(outputStream, new Date().toString());
            }
        } catch (IOException ex) {
            logger.info("Server exception: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}
