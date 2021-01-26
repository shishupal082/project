package com.project.communication.capitalization;// package socketClient;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppConstant;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.service.ReadInput;
import com.project.communication.threads.ReadInputThread;

import java.io.*;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.util.Timer;

/**
 * Created by shishupalkumar on 12/08/16.
 */
public class CapitalizationClient {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(CapitalizationClient.class);
    private final BufferedReader systemIn;
    private Socket socket;
    private Timer timer;
    private int count = 0;
    private int inCount = 0;
    private int outCount = 0;
    private ReadInputThread threadRead;
    private CapitalizationClient(Socket socket) {
        this.socket = socket;
        systemIn = new BufferedReader(new InputStreamReader(System.in));
    }
    private void startTimer() {
        count++;
        timer = new Timer();
        timer.schedule(threadRead, 0, 20);
    }
    public String getResponse() {
        String response = null;
        try {
            inCount++;
            InputStream inputStream = socket.getInputStream();
            response = ReadInput.readBytes(0, inputStream);
            logger.info("Socket output : " + inCount + ":" + response);
        } catch (IOException e) {
            logger.info("Error" + e.getMessage());
            e.printStackTrace();
        }
        return response;
    }
    private void sendRequest(String request) {
        try {
            outCount++;
            logger.info("Request : " + outCount +  ":" + request);
            OutputStream outToServer = socket.getOutputStream();
            DataOutputStream dataOutputStream = new DataOutputStream(outToServer);
            request += "|END";
//            dataOutputStream.writeBytes(request);
            dataOutputStream.write(request.getBytes(AppConstant.UTF_8));
        } catch (IOException e) {
            logger.info("Error in sending request");
        }
    }
    private void startCommunication() throws IOException{
//        System.out.println(getResponse());
//        InputStream inputStream = socket.getInputStream();
        System.out.print("Enter string 1 : ");
        String userInput = systemIn.readLine();
        sendRequest(userInput);
//        System.out.println("Socket output : " + getResponse(inputStream));

        System.out.print("Enter string 2 : ");
        userInput = systemIn.readLine();
        sendRequest(userInput);
//        System.out.println("Socket output : " + getResponse(inputStream));

        sendRequest("Dummy Input String.");
//        System.out.println("Socket output : " + getResponse(inputStream));

        System.out.print("Enter string 3 : ");
        userInput = systemIn.readLine();
        sendRequest(userInput);
//        System.out.println("Socket output : " + getResponse(inputStream));
    }
    private void startCommunicationV2() {
        String input = "";
        do {
            input = ReadInput.readCommandLine();
            logger.info("input: " + input);
            sendRequest(input);
        } while (!input.equals("bye"));
    }
    public static void main(ProtocolConfig protocolConfig) {
        String ip = protocolConfig.getServerIp();
        int port = protocolConfig.getServerPort();
        try {
            Socket socket = new Socket();
            socket.connect(new InetSocketAddress(ip, port), 10000);
            CapitalizationClient client = new CapitalizationClient(socket);
            client.threadRead = new ReadInputThread(client);
            client.startTimer();
//            client.startCommunication();
            client.startCommunicationV2();
            socket.close();
//            client.connectToServer(ip, port);
        } catch (Exception e) {
            System.out.println("Socket output : " + e.getMessage());
        }
    }
}
