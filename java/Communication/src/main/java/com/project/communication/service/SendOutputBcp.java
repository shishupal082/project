package com.project.communication.service;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;

import java.io.DataOutputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.Socket;

public class SendOutputBcp {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(SendOutputBcp.class);
    public SendOutputBcp() {}
    public static void sendLine(OutputStream outputStream, String text) {
        PrintWriter writer = new PrintWriter(outputStream, true);
        writer.println(text);
    }
    public static void send(Socket socket, String data)  {
        try {
            OutputStream outToServer = socket.getOutputStream();
            DataOutputStream dataOutputStream = new DataOutputStream(outToServer);
            int dataType = 233;
            int length = 256;
            dataOutputStream.write((byte) dataType);
            dataOutputStream.write((byte) length);
            byte[] data2 = data.getBytes();
            dataOutputStream.write(data2);
        } catch (Exception e) {
            logger.info("Error in sending output");
        }
        logger.info("Data send: "+data);
    }
}
