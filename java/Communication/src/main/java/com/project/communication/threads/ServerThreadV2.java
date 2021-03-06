package com.project.communication.threads;

import com.project.communication.capitalization.CapitalizationServer;
import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppReferenceEnum;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.service.ReadInput;

import java.io.IOException;
import java.net.Socket;
import java.util.ArrayList;

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
        this.readInput = new ReadInput(clientId, AppReferenceEnum.ONE, protocolConfig);
    }
    public void run() {
        try {
            CapitalizationServer server = new CapitalizationServer(protocolConfig, readInput, socket);
            ArrayList<String> welcomeMessage = protocolConfig.getWelcomeMessage();
            if (welcomeMessage != null) {
                for (String str: welcomeMessage) {
                    server.sendResponse(str);
                }
            }
            readInput.readBytes(socket.getInputStream(), server,
                    null, null, null, null);
        } catch (IOException e) {
            logger.info(clientId+": Error in client handling");
        }
    }
}
