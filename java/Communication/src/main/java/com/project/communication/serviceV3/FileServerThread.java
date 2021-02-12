package com.project.communication.serviceV3;

import com.project.communication.capitalization.CapitalizationServer;
import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppReferenceEnum;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.service.ReadInput;
import com.project.communication.serviceV3.common.ReadInputV2;

import java.io.IOException;
import java.net.Socket;
import java.util.ArrayList;

public class FileServerThread extends Thread {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(FileServerThread.class);
    private final ProtocolConfig protocolConfig;
    private final ReadInputV2 readInputV2;
    private final Socket socket;
    private final int clientId;
    public FileServerThread(ProtocolConfig protocolConfig, int clientId, Socket socket) {
        this.protocolConfig = protocolConfig;
        this.clientId = clientId;
        this.socket = socket;
        this.readInputV2 = new ReadInputV2(clientId, AppReferenceEnum.ONE, protocolConfig);
    }
    public void run() {
        try {
            FileServer server = new FileServer(socket, readInputV2, protocolConfig);
            ArrayList<String> welcomeMessage = protocolConfig.getWelcomeMessage();
            if (welcomeMessage != null) {
                for (String str: welcomeMessage) {
                    server.sendResponse(str);
                }
            }
            readInputV2.readBytes(socket.getInputStream(), server, null);
        } catch (IOException e) {
            logger.info(clientId+": Error in client handling");
        }
    }
}
