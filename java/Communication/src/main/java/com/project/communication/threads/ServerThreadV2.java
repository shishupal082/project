package com.project.communication.threads;

import com.project.communication.capitalization.CapitalizationServer;
import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.service.ReadInput;

import java.io.IOException;
import java.net.Socket;

public class ServerThreadV2 extends Thread {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(ServerThreadV2.class);
    private final ProtocolConfig protocolConfig;
    private final ReadInput readInput;
    private final Socket socket;
    private final int clientId;
    public ServerThreadV2(ProtocolConfig protocolConfig, int clientId, Socket socket) {
        this.protocolConfig = protocolConfig;
        this.clientId = clientId;
        this.socket = socket;
        this.readInput = new ReadInput(clientId, 1);
    }
    public void run() {
        try {
            CapitalizationServer server = new CapitalizationServer(protocolConfig, readInput, socket);
            server.sendResponse("Welcome! #" + clientId);
            readInput.readBytes(socket.getInputStream(), server,
                    null, null, null, null);
        } catch (IOException e) {
            logger.info(clientId+": Error in client handling");
        }
    }
}
