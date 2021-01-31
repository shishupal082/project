package com.project.communication.capitalization;// package socketClient;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppConstant;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.obj.ReadCharDataTimer;
import com.project.communication.service.ReadInput;
import com.project.communication.service.SocketService;
import com.project.communication.threads.ReadInputThread;

import java.io.*;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.util.Timer;

/**
 * Created by shishupalkumar on 12/08/16.
 */
public class CapitalizationClient implements Runnable {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(CapitalizationClient.class);
    private final BufferedReader systemIn;
    private ProtocolConfig protocolConfig;
    private Socket socket;
    private Timer timer;
    private CapitalizationClient client = null;
    private int count = 0;
    private int inCount = 0;
    private int outCount = 0;
    private ReadInputThread threadRead;
    private ReadCharDataTimer oldTimer;
    private CapitalizationClient(ProtocolConfig protocolConfig, Socket socket) {
        this.protocolConfig = protocolConfig;
        this.socket = socket;
        systemIn = new BufferedReader(new InputStreamReader(System.in));
    }
    private void startTimer() {
        count++;
        timer = new Timer();
        timer.schedule(threadRead, 0, 20);
    }
    private void stopTimer() {
        timer.cancel();
    }
    public void receivedData(String byteData) {
        if (byteData == null || byteData.length() < 1) {
            return;
        }
        logger.info("Received data: " + byteData);
        ReadInput.resetByteData();
    }
    private void sendRequest(String request) {
        try {
            outCount++;
            logger.info("Sending Request : " + outCount +  ":" + request);
            OutputStream outToServer = socket.getOutputStream();
            DataOutputStream dataOutputStream = new DataOutputStream(outToServer);
            dataOutputStream.write(request.getBytes(AppConstant.UTF_8));
        } catch (IOException e) {
            logger.info("Error in sending request");
        }
    }
    public void run() {
        logger.info("Enter string: ");
        String input = "";
        do {
            input = ReadInput.readCommandLine();
            logger.info("input: " + input);
            sendRequest(input);
        } while (!input.equals("bye"));
        ReadInput.stopTimer();
        SocketService.close(0, socket);
    }
    public static void main(ProtocolConfig protocolConfig) {
        String ip = protocolConfig.getServerIp();
        int port = protocolConfig.getServerPort();
        try {
            Socket socket = new Socket();
            socket.connect(new InetSocketAddress(ip, port), 10000);
            CapitalizationClient capitalizationClient = new CapitalizationClient(protocolConfig, socket);
            Thread thread = new Thread(capitalizationClient);
            thread.start();
            ReadInput.readBytes(0, socket.getInputStream(), 2,
                    null, capitalizationClient);
        } catch (Exception e) {
            logger.info("Socket output : " + e.getMessage());
        }
    }
}
