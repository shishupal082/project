package com.project.communication.capitalization;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.service.ReadInput;

import java.io.IOException;
import java.net.Socket;

public class ServerThreadV2 extends Thread {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(ServerThreadV2.class);
    private final Socket socket;
    private final int clientId;
    private final ProtocolConfig protocolConfig;
    public ServerThreadV2(ProtocolConfig protocolConfig, int clientId, Socket socket) {
        this.protocolConfig = protocolConfig;
        this.clientId = clientId;
        this.socket = socket;
    }
    public void run() {
        try {
            CapitalizationServer server = new CapitalizationServer(protocolConfig, clientId, socket);
            server.sendResponse("Welcome! #" + clientId);
            ReadInput.readBytes(clientId, socket.getInputStream(), 1, server, null);
        } catch (IOException e) {
            logger.info(clientId+": Error in client handling");
        }
    }
}
