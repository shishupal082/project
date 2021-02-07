package com.project.communication.capitalization;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppReference;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.service.ReadInput;
import com.project.communication.service.SendOutput;
import com.project.communication.service.SocketService;

import java.io.*;
import java.net.Socket;
import java.net.UnknownHostException;
public class SingleThreadedCapitalizationClient {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(SingleThreadedCapitalizationClient.class);
    public static void main(ProtocolConfig protocolConfig) {
        ReadInput readInput = new ReadInput(0, AppReference.ZERO, protocolConfig);
        String hostname = protocolConfig.getServerIp();
        int port = protocolConfig.getServerPort();
        Socket socket = null;
        try {
            socket = new Socket(hostname, port);
            OutputStream outputStream = socket.getOutputStream();
            InputStream inputStream = socket.getInputStream();
            int x = inputStream.available();
            BufferedReader console = new BufferedReader(new InputStreamReader(System.in));
            String text;
            do {
                text = console.readLine();
                SendOutput.sendLine(outputStream, text);
                String result = readInput.readLine(inputStream);
                if (text == null) {
                    logger.info("Error in reading");
                    break;
                }
                logger.info(result);
            } while (!text.equals("bye"));
            socket.close();
        } catch (UnknownHostException ex) {
            SocketService.close(0, socket);
            logger.info("Server not found: " + ex.getMessage());
        } catch (IOException ex) {
            SocketService.close(0, socket);
            logger.info("I/O error: " + ex.getMessage());
        }
    }
}
