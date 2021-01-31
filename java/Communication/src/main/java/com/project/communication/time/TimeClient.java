package com.project.communication.time;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.service.ReadInput;

import java.io.IOException;
import java.io.InputStream;
import java.net.Socket;
import java.net.UnknownHostException;

public class TimeClient {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(TimeClient.class);
    public static void main(ProtocolConfig protocolConfig) {
        ReadInput readInput = new ReadInput(0, 0);
        String hostname = protocolConfig.getServerIp();
        int port = protocolConfig.getServerPort();
        try (Socket socket = new Socket(hostname, port)) {
            InputStream inputStream = socket.getInputStream();
            String time = readInput.readLine(inputStream);
            logger.info(time);
        } catch (UnknownHostException ex) {
            logger.info("Time Server not found: " + ex.getMessage());
        } catch (IOException ex) {
            logger.info("I/O error: " + ex.getMessage());
        }
    }
}
