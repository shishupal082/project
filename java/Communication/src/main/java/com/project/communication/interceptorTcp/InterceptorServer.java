package com.project.communication.interceptorTcp;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppConstant;
import com.project.communication.config.AppReferenceEnum;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.service.ReadInput;
import com.project.communication.threads.interceptor.Interceptor;
import com.project.communication.threads.interceptor.InterceptorClient;

import java.io.DataOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;

public class InterceptorServer {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(InterceptorServer.class);
    private final ProtocolConfig protocolConfig;
    private final ReadInput readInput;
    private Socket socket;
    public InterceptorServer(ProtocolConfig protocolConfig) {
        logger.info("interceptorServer: " + protocolConfig.toString());
        this.protocolConfig = protocolConfig;
        this.readInput = new ReadInput(1, AppReferenceEnum.THREE, protocolConfig);
    }

    public Socket getSocket() {
        return socket;
    }

    public void setSocket(Socket socket) {
        this.socket = socket;
    }

    public void receivedData(String data, InterceptorClient interceptorClient, Interceptor interceptor) {
        if (data == null || data.length() < 1) {
            return;
        }
        try {
            logger.info("Interceptor server Sending Response: " + data);
            Socket socket = interceptorClient.getSocket();
            if (socket == null) {
                logger.info("Interceptor client socket is null.");
                return;
            }
            OutputStream outToServer = interceptorClient.getSocket().getOutputStream();
            DataOutputStream dataOutputStream = new DataOutputStream(outToServer);
            dataOutputStream.write(data.getBytes(AppConstant.UTF_8));
            readInput.resetByteData();
        } catch (IOException e) {
            logger.info("Error in sending data");
        }
    }

    public void start(InterceptorServer interceptorServer, InterceptorClient interceptorClient, Interceptor interceptor) {
        int port = protocolConfig.getClientPort();
        int clientNumber = 0;
        try {
            ServerSocket serverSocket = new ServerSocket(port);
            logger.info("Interceptor server is running on port: " + port);
            clientNumber++;
            Socket socket = serverSocket.accept();
            this.setSocket(socket);
            interceptorServer.setSocket(socket);
            interceptor.setServerSocket(socket);
            logger.info(clientNumber+": New client connected");
//            new InterceptorThread(protocolConfig, clientNumber, socket).start();
            readInput.readBytes(socket.getInputStream(), null, null,
                    this, interceptorClient, interceptor);
        } catch (Exception e) {
            logger.info("Error in capitalize");
        }
    }
}
