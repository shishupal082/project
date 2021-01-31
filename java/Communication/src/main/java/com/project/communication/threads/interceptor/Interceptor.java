package com.project.communication.threads.interceptor;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppConstant;
import com.project.communication.interceptorTcp.InterceptorServer;
import com.project.communication.obj.ProtocolConfig;

import java.net.Socket;

public class Interceptor extends Thread {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(Interceptor.class);
    private InterceptorServer interceptorServer = null;
    private InterceptorClient interceptorClient = null;
    private Socket serverSocket;
    private Socket clientSocket;
    public Interceptor(ProtocolConfig protocolConfig, String name) {
        if (AppConstant.appNameServer.equals(name)) {
            interceptorServer = new InterceptorServer(protocolConfig);
            this.startServer();
        }
        if (AppConstant.appNameClient.equals(name)) {
            interceptorClient = new InterceptorClient(protocolConfig, null);
            this.startClient();
        }
    }

    @Override
    public void run() {
        logger.info("Done");
    }

    public Socket getServerSocket() {
        return serverSocket;
    }

    public void setServerSocket(Socket serverSocket) {
        this.serverSocket = serverSocket;
    }

    public Socket getClientSocket() {
        return clientSocket;
    }

    public void setClientSocket(Socket clientSocket) {
        this.clientSocket = clientSocket;
    }

    public void startServer() {
        interceptorServer.start(interceptorServer, interceptorClient, this);
    }
    public void startClient() {
        interceptorClient.start(interceptorServer, interceptorClient, this);
    }
}
