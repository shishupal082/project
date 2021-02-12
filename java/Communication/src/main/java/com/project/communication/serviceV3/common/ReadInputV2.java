package com.project.communication.serviceV3.common;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppConstant;
import com.project.communication.config.AppReferenceEnum;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.service.SendOutput;
import com.project.communication.serviceV3.ActualClient;
import com.project.communication.serviceV3.FileClient;
import com.project.communication.serviceV3.FileServer;

import java.io.*;
import java.net.Socket;
import java.util.Timer;

public class ReadInputV2 {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(ReadInputV2.class);
    private final static BufferedReader systemIn = new BufferedReader(new InputStreamReader(System.in));
    private final ProtocolConfig protocolConfig;
    public String byteData = "";
    public boolean breakRead = false;
    public TcpFileReadTimer oldTimerV4 = null;
    private final int clientId;
    private final AppReferenceEnum reference; // 0 for client, 1 for server
    public ReadInputV2(int clientId, final AppReferenceEnum reference, ProtocolConfig protocolConfig) {
        this.protocolConfig = protocolConfig;
        this.clientId = clientId;
        this.reference = reference;
    }
    public void stopTimer() {
        if (oldTimerV4 != null) {
            breakRead = true;
            oldTimerV4.cancel();
        }
    }
    public ProtocolConfig getProtocolConfig() {
        return protocolConfig;
    }

    public int getClientId() {
        return clientId;
    }
    public AppReferenceEnum getReference() {
        return reference;
    }
    public String getByteData() {
        return byteData;
    }
    public void resetByteData() {
        byteData = "";
    }
    private void sendResponseByte(Socket socket, String response) {
        try {
            OutputStream outToServer = socket.getOutputStream();
            DataOutputStream dataOutputStream = new DataOutputStream(outToServer);
            dataOutputStream.write(response.getBytes(AppConstant.UTF_8));
        } catch (IOException e) {
            logger.info("Error in sending data");
        }
    }
    private void sendResponseText(Socket socket, String response) {
        try {
            OutputStream outputStream = socket.getOutputStream();
            SendOutput.sendLine(outputStream, response);
        } catch (IOException e) {
            logger.info("Error in sending data");
        }
    }
    public void sendData(Socket socket, String response) {
        if (AppConstant.protocolByte.equals(this.protocolConfig.getType())) {
            this.sendResponseByte(socket, response);
        } else if (AppConstant.protocolText.equals(this.protocolConfig.getType())) {
            this.sendResponseText(socket, response);
        }
    }
    public void readBytes(InputStream inputStream,
                          FileServer fileServer,
                          FileClient fileClient,
                          ActualClient actualClient) {
        TcpFileReadTimer readCharDataTimer = new TcpFileReadTimer(this,
                fileServer, fileClient, actualClient);
        if (oldTimerV4 != null) {
            logger.info(clientId+": closing old timer");
            this.stopTimer();
        }
        Timer timer = new Timer();
        timer.schedule(readCharDataTimer, 0, 1000);
        oldTimerV4 = readCharDataTimer;
        try {
            if (AppConstant.protocolText.equals(protocolConfig.getType())) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
                do {
                    byteData = reader.readLine();
                } while (!breakRead);
            } else if (AppConstant.protocolByte.equals(protocolConfig.getType())) {
                BufferedInputStream buf = new BufferedInputStream(inputStream);
                DataInputStream dataInputStream = new DataInputStream(buf);
                int dataIn = dataInputStream.readByte();
                do {
                    byteData += (char) dataIn;
                    dataIn = dataInputStream.readByte();
                } while (!breakRead);
            }
        } catch (IOException e) {
            logger.info(clientId+": Error in reading input");
            e.printStackTrace();
        }
    }
    public void readBytesV2(InputStream inputStream,
                          FileServer fileServer,
                          FileClient fileClient) {
        TcpFileReadTimer readCharDataTimer = new TcpFileReadTimer(this,
                fileServer, fileClient, null);
        if (oldTimerV4 != null) {
            logger.info(clientId+": closing old timer");
            this.stopTimer();
        }
        Timer timer = new Timer();
        timer.schedule(readCharDataTimer, 0, 1000);
        oldTimerV4 = readCharDataTimer;
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
            byteData = reader.readLine();
        } catch (IOException e) {
            logger.info(clientId+": Error in reading input");
            e.printStackTrace();
        }
    }

}
