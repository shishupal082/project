package com.project.communication.serviceV3;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppConstant;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.parser.TextFileParser;
import com.project.communication.serviceV3.common.ReadInputV2;

import java.io.DataOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;

public class FileServer {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(FileServer.class);
    private int outCount = 0;
    private final Socket socket;
    private final ReadInputV2 readInputV2;
    private final ProtocolConfig protocolConfig;
    public FileServer(Socket socket, ReadInputV2 readInputV2, ProtocolConfig protocolConfig) {
        this.socket = socket;
        this.readInputV2 = readInputV2;
        this.protocolConfig = protocolConfig;
    }
    public void receivedData(String filepath) {
        if (filepath != null && !filepath.trim().equals("")) {
            TextFileParser textFileParser = new TextFileParser(filepath);
            ArrayList<String> fileData = textFileParser.getTextDataByLine();
            String result = "";
            if (fileData.size() > 0) {
                for (String str: fileData) {
                    result = result.concat(str);
                }
                logger.info("Response data: ", result);
            } else {
                result = "file not found";
            }
            this.sendResponse(result);
            readInputV2.resetByteData();
        }
    }
    public void sendResponse(String response) {
        outCount++;
        logger.info("Sending Request count: " + outCount +  " :" + response);
        readInputV2.sendData(socket, response);
    }
    public static void main(ProtocolConfig protocolConfig) {
        int port = protocolConfig.getClientPort();
        int clientId = 0;
        try (ServerSocket serverSocket = new ServerSocket(port)) {
            logger.info("Server is listening on port " + port);
            while (true) {
                clientId++;
                Socket socket = serverSocket.accept();
                logger.info(clientId+": New client connected");
                new FileServerThread(protocolConfig, clientId, socket).start();
            }
        } catch (IOException ex) {
            logger.info("Server exception: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}
