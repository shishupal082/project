package com.project.communication.capitalization;

import com.project.communication.obj.ProtocolConfig;

import java.net.Socket;

public class ServerThread extends Thread {
    private final Socket socket;
    private final int clientId;
    private final ProtocolConfig protocolConfig;
    public ServerThread(ProtocolConfig protocolConfig, int clientId, Socket socket) {
        this.protocolConfig = protocolConfig;
        this.clientId = clientId;
        this.socket = socket;
    }
    public void run() {
        new ServerProgram(protocolConfig, clientId, socket).start();
    }
}
