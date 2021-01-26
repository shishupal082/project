package com.project.communication.service;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;

import java.io.IOException;
import java.io.InputStream;
import java.net.Socket;

public class SocketService {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(SocketService.class);
    public static void close(int clientId, Socket socket) {
        // clientId = 0, for client application
        if (socket == null) {
            logger.info(clientId + "Error in closing socket, null");
            return;
        }
        try {
            socket.close();
        } catch (IOException e) {
            logger.info(clientId + "Error in closing socket" + e.getMessage());
//            e.printStackTrace();
        }
    }
    public static InputStream getInputStream(int clientId, Socket socket) {
        if (socket == null) {
            return null;
        }
        try {
            socket.getInputStream();
        } catch (IOException e) {
            logger.info(clientId+": Error in getting inputStream from socket");
        }
        return null;
    }
}
