package com.project.communication.capitalization;

import com.project.communication.obj.ProtocolConfig;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

public class MultiThreadedCapitalizationServer {
    public static void main(ProtocolConfig protocolConfig) {
        int port = protocolConfig.getClientPort();
        int clientId = 0;
        try (ServerSocket serverSocket = new ServerSocket(port)) {
            System.out.println("Server is listening on port " + port);
            while (true) {
                clientId++;
                Socket socket = serverSocket.accept();
                System.out.println(clientId+": New client connected");
                new ServerThread(protocolConfig, clientId, socket).start();
            }
        } catch (IOException ex) {
            System.out.println("Server exception: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}
