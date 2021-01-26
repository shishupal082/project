package com.project.communication.capitalization;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppConstant;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.service.ReadInput;
import com.project.communication.service.SendOutput;
import com.project.communication.service.SocketService;

import java.io.*;
import java.net.Socket;
import java.util.StringTokenizer;

public class Capitalize {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(Capitalize.class);
    private final Socket socket;
    private final int clientId;
    private final ProtocolConfig protocolConfig;
    private int inCount = 0;
    public Capitalize(ProtocolConfig protocolConfig, int clientId, Socket socket) {
        this.protocolConfig = protocolConfig;
        this.clientId = clientId;
        this.socket = socket;
    }
    private String getRequest() throws IOException {
        String request;
        InputStream inputStream = socket.getInputStream();
        BufferedInputStream inBuf = new BufferedInputStream(inputStream);
        DataInputStream dataInputStream = new DataInputStream(inBuf);
        String parsedRequest = "";
        int dataIn = dataInputStream.readByte();
        while(dataIn > 0) {
            parsedRequest += (char) dataIn;
            StringTokenizer st = new StringTokenizer(parsedRequest, "|");
            boolean isRequestEnd = false;
            while (st.hasMoreElements()) {
                if (st.nextElement().equals("END")) {
                    isRequestEnd = true;
                    while (dataInputStream.available() > 0) {
                        dataInputStream.readByte();
                    }
                    break;
                }
            }
            if (isRequestEnd) {
                break;
            }
            dataIn = dataInputStream.read();
        }
        request = parsedRequest;
        inCount++;
        logger.info(clientId + " : Request : " + inCount + request);
        return request;
    }
    private void sendResponse(String response) throws IOException {
        logger.info(clientId + " : Response : " + response);
        response += "|END";
        OutputStream outToServer = socket.getOutputStream();
        DataOutputStream dataOutputStream = new DataOutputStream(outToServer);
//                dataOutputStream.writeBytes(response);
        dataOutputStream.write(response.getBytes(AppConstant.UTF_8));
    }
    public void start() {
        try {
            while (true) {
                String input = this.getRequest();
                if (input == null || input.equals(".")) {
                    logger.info(clientId + " : socketClosed");
                    this.sendResponse("socketClosed");
                    break;
                }
                logger.info(clientId + " : Capitalizing... : " + input);
                this.sendResponse(input.toUpperCase());
            }
        } catch (IOException e) {
            logger.info("Error handling client# " + clientId + ": " + e);
        } finally {
            SocketService.close(clientId, socket);
            logger.info("Connection with client# " + clientId + " closed");
        }
    }
}
