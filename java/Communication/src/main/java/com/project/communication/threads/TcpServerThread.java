package com.project.communication.threads;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppReference;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.service.ReadInput;
import com.project.communication.tcp.TcpServer;

import java.io.IOException;
import java.net.Socket;
import java.util.ArrayList;

public class TcpServerThread extends Thread {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(TcpServerThread.class);
    private final ProtocolConfig protocolConfig;
    private final ReadInput readInput;
    private final Socket socket;
    private final int clientId;
    public TcpServerThread(ProtocolConfig protocolConfig, int clientId, Socket socket) {
        this.protocolConfig = protocolConfig;
        this.clientId = clientId;
        this.socket = socket;
        this.readInput = new ReadInput(clientId, AppReference.ONE, protocolConfig);
    }
    public void run() {
        try {
            TcpServer server = new TcpServer(protocolConfig, readInput, socket);
            ArrayList<String> welcomeMessage = protocolConfig.getWelcomeMessage();
            if (welcomeMessage != null) {
                for (String str: welcomeMessage) {
                    server.sendResponse(str);
                }
            }
            readInput.readBytesV2(socket.getInputStream(), server, null);
        } catch (IOException e) {
            logger.info(clientId+": Error in client handling");
        }
    }
}
