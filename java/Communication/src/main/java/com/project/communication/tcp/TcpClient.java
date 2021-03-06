package com.project.communication.tcp;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppConstant;
import com.project.communication.config.AppReferenceEnum;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.service.ReadInput;
import com.project.communication.service.SocketService;

import java.io.*;
import java.net.InetSocketAddress;
import java.net.Socket;

public class TcpClient implements Runnable {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(TcpClient.class);
    private final BufferedReader systemIn;
    private final ProtocolConfig protocolConfig;
    private final Socket socket;
    private final ReadInput readInput;
    private int outCount = 0;
    private TcpClient(ProtocolConfig protocolConfig, Socket socket) {
        this.protocolConfig = protocolConfig;
        this.socket = socket;
        this.readInput = new ReadInput(0, AppReferenceEnum.TWO, protocolConfig);
        systemIn = new BufferedReader(new InputStreamReader(System.in));
    }
    public void receivedData(String byteData) {
        if (byteData == null || byteData.length() < 1) {
            return;
        }
        logger.info("Received data: " + byteData);
        readInput.resetByteData();
    }
    private void sendRequest(String request) {
        try {
            outCount++;
            logger.info("Sending Request count: " + outCount +  " :" + request);
            OutputStream outToServer = socket.getOutputStream();
            DataOutputStream dataOutputStream = new DataOutputStream(outToServer);
            dataOutputStream.writeInt(233);
            dataOutputStream.writeInt(256);
            dataOutputStream.write(request.getBytes(AppConstant.UTF_8));
        } catch (IOException e) {
            logger.info("Error in sending request");
        }
    }
    public void run() {
        logger.info("Enter string: ");
        String input = "";
        do {
            input = readInput.readCommandLine();
            logger.info("input: " + input);
            sendRequest(input);
        } while (!input.equals("bye"));
        readInput.stopTimer();
        SocketService.close(0, socket);
    }
    public static void main(ProtocolConfig protocolConfig) {
        String ip = protocolConfig.getServerIp();
        int port = protocolConfig.getServerPort();
        try {
            Socket socket = new Socket();
            socket.connect(new InetSocketAddress(ip, port), 10000);
            TcpClient client = new TcpClient(protocolConfig, socket);
            Thread thread = new Thread(client);
            thread.start();
            client.readInput.readBytesV2(socket.getInputStream(), null, client);
        } catch (Exception e) {
            logger.info("Socket output : " + e.getMessage());
        }
    }
}
