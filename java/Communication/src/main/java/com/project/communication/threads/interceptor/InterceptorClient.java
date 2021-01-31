package com.project.communication.threads.interceptor;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppConstant;
import com.project.communication.interceptorTcp.InterceptorServer;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.service.ReadInput;

import java.io.DataOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.Socket;

public class InterceptorClient implements Runnable {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(InterceptorClient.class);
    private final ProtocolConfig protocolConfig;
    private Socket socket;
    private String byteData;
    private final ReadInput readInput;
    private int outCount = 0;
    public InterceptorClient(ProtocolConfig protocolConfig, Socket socket) {
        logger.info("interceptorClient: " + protocolConfig.toString());
        this.protocolConfig = protocolConfig;
        this.socket = socket;
        this.readInput = new ReadInput(0, 4);
    }

    public Socket getSocket() {
        return socket;
    }

    public void setSocket(Socket socket) {
        this.socket = socket;
    }

    public void receivedData(String data, InterceptorServer interceptorServer, Interceptor interceptor) {
        if (data == null || data.length() < 1) {
            return;
        }
        try {
            logger.info("Interceptor client Sending Response: " + data);
            Socket socket = interceptorServer.getSocket();
            if (socket == null) {
                logger.info("Interceptor server socket is null.");
                return;
            }
            OutputStream outToServer = interceptorServer.getSocket().getOutputStream();
            DataOutputStream dataOutputStream = new DataOutputStream(outToServer);
            dataOutputStream.write(data.getBytes(AppConstant.UTF_8));
            readInput.resetByteData();
        } catch (IOException e) {
            logger.info("Error in sending data");
        }
    }

    private void sendData(String request) {
        try {
            outCount++;
            logger.info("Sending Request count: " + outCount +  " :" + request);
            OutputStream outToServer = socket.getOutputStream();
            DataOutputStream dataOutputStream = new DataOutputStream(outToServer);
            dataOutputStream.write(request.getBytes(AppConstant.UTF_8));
        } catch (IOException e) {
            logger.info("Error in sending request");
        }
    }
    public void run() {}
    public void start(InterceptorServer interceptorServer, InterceptorClient interceptorClient, Interceptor interceptor) {
        String ip = protocolConfig.getServerIp();
        int port = protocolConfig.getServerPort();
        try {
            Socket socket = new Socket();
            socket.connect(new InetSocketAddress(ip, port), 10000);
            this.setSocket(socket);
            interceptorClient.setSocket(socket);
            interceptor.setClientSocket(socket);
            InterceptorClient client = new InterceptorClient(protocolConfig, socket);
            Thread thread = new Thread(client);
            thread.start();
            client.readInput.readBytes(socket.getInputStream(), null, null,
                    interceptorServer, client, interceptor);
        } catch (Exception e) {
            logger.info("Socket output : " + e.getMessage());
        }
    }
}
