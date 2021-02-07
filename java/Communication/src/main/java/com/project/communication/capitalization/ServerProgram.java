package com.project.communication.capitalization;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppReference;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.service.ReadInput;
import com.project.communication.service.SendOutput;
import com.project.communication.service.SocketService;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

public class ServerProgram {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(ServerProgram.class);
    private final Socket socket;
    private final int clientId;
    private final ProtocolConfig protocolConfig;
    private final ReadInput readInput;
    public ServerProgram(ProtocolConfig protocolConfig, int clientId, Socket socket) {
        this.protocolConfig = protocolConfig;
        this.clientId = clientId;
        this.socket = socket;
        this.readInput = new ReadInput(0, AppReference.ZERO, protocolConfig);
    }
    public void start() {
        try {
            while (true) {
                InputStream inputStream = socket.getInputStream();
                OutputStream outputStream = socket.getOutputStream();
                String text;
                do {
                    text = readInput.readLine(inputStream);
                    if (text == null) {
                        logger.info(clientId + ": Error in reading input");
                        break;
                    }
                    logger.info(clientId + ": input: " + text);
                    String reverseText = new StringBuilder(text).reverse().toString();
                    SendOutput.sendLine(outputStream, "Server: " + reverseText);
                    logger.info(clientId + ": output: " + reverseText);
                } while (!text.equals("bye"));
                SocketService.close(clientId, socket);
            }
        } catch (IOException e) {
            SocketService.close(clientId, socket);
            logger.info(clientId + ": Server exception: " + e.getMessage());
        }
    }
}
