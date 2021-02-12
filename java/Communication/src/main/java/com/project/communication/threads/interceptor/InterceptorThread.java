package com.project.communication.threads.interceptor;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppReferenceEnum;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.service.ReadInput;

import java.net.Socket;

public class InterceptorThread extends Thread {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(InterceptorThread.class);
    private final ProtocolConfig protocolConfig;
    private final ReadInput readInput;
    private final Socket socket;
    private final int clientId;
    public InterceptorThread(ProtocolConfig protocolConfig, int clientId, Socket socket) {
        this.protocolConfig = protocolConfig;
        this.clientId = clientId;
        this.socket = socket;
        this.readInput = new ReadInput(clientId, AppReferenceEnum.ONE, protocolConfig);
    }
    public void run() {
//        try {
//            CapitalizationServer server = new CapitalizationServer(protocolConfig, readInput, socket);
//            server.sendResponse("Welcome! #" + clientId);
//            readInput.readBytes(socket.getInputStream(), server, null, null, this);
//        } catch (IOException e) {
//            logger.info(clientId+": Error in client handling");
//        }
    }
}
