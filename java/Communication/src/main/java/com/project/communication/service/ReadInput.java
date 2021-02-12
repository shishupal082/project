package com.project.communication.service;

import com.project.communication.capitalization.CapitalizationClient;
import com.project.communication.capitalization.CapitalizationServer;
import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppConstant;
import com.project.communication.config.AppReferenceEnum;
import com.project.communication.interceptorTcp.InterceptorServer;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.obj.ReadData;
import com.project.communication.tcp.TcpClient;
import com.project.communication.tcp.TcpServer;
import com.project.communication.threads.ReadCharDataTimer;
import com.project.communication.threads.ReadTcpDataTimer;
import com.project.communication.threads.interceptor.Interceptor;
import com.project.communication.threads.interceptor.InterceptorClient;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Timer;

public class ReadInput {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(ReadInput.class);
    private final static BufferedReader systemIn = new BufferedReader(new InputStreamReader(System.in));;
    private final ProtocolConfig protocolConfig;
    public String byteData = "";
    public boolean breakRead = false;
    public ReadCharDataTimer oldTimer = null;
    public ReadTcpDataTimer oldTimerV2 = null;
    private final int clientId;
    private final AppReferenceEnum reference; // 1 for server, 2 for client, 0 for timeClient
    // 3 for interceptor server, 4 for interceptor client
    public ReadInput(int clientId, final AppReferenceEnum reference, ProtocolConfig protocolConfig) {
        this.protocolConfig = protocolConfig;
        this.clientId = clientId;
        this.reference = reference;
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
    public void stopTimer() {
        if (oldTimer != null) {
            oldTimer.cancel();
        }
    }
    public String readLine(InputStream inputStream) {
        String result = null;
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
            result = reader.readLine();
        } catch (IOException ex) {
            logger.info("I/O error: " + ex.getMessage());
        }
        return result;
    }
    public String readCommandLine() {
        logger.info("Read command line");
        String text = "";
        try {
            return systemIn.readLine();
        } catch (IOException e) {
            logger.info("IOException for reading command line");
        }
        return text;
    }
    private void readWithoutTLV(InputStream inputStream) {
        logger.info("readWithoutTLV");
        try {
            BufferedInputStream buf = new BufferedInputStream(inputStream);
            DataInputStream dataInputStream = new DataInputStream(buf);
            int dataIn = dataInputStream.readByte();
//            logger.info("dataIn1:"+byteData);
            while (dataIn > 0) {
                byteData += (char)dataIn;
                dataIn = dataInputStream.readByte();
//                logger.info("dataIn2:"+byteData);
                if (breakRead) {
                    logger.info("breaking from loop");
                    break;
                }
            }
            breakRead = false;
        } catch (IOException e) {
            logger.info(clientId+": Error in reading input");
            e.printStackTrace();
        }
    }
    private void readWithTLV(InputStream inputStream) {
        logger.info("readWithTLV");
        try {
            DataInputStream in = new DataInputStream(inputStream);
            //TLV: Type, Length, Value
            int dataType = in.readChar();//233
            int length = in.readInt();//256
            logger.info(clientId+": dataType="+dataType+",length="+length);
            byte[] messageByte = new byte[length];
            boolean end = false;
            StringBuilder dataString = new StringBuilder(length);
            byteData = dataString.toString();
            int totalBytesRead = 0;
            while(!end) {
                logger.info(clientId+": Waiting for in.read");
                int currentBytesRead = in.read(messageByte);
                logger.info(clientId+": in.read found");
                totalBytesRead = currentBytesRead + totalBytesRead;
                if(totalBytesRead <= length) {
                    dataString.append(new String(messageByte, 0, currentBytesRead, StandardCharsets.UTF_8));
                } else {
                    dataString
                            .append(new String(messageByte, 0, length - totalBytesRead + currentBytesRead,
                                    StandardCharsets.UTF_8));
                }
                byteData = dataString.toString();
                if(dataString.length()>=length) {
                    end = true;
                }
            }
        } catch (IOException ex) {
            logger.info("Server exception handleCharRequest: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
    public void readBytesV2(InputStream inputStream, TcpServer tcpServer, TcpClient tcpClient) {
        ReadData readData = new ReadData();
        ReadTcpDataTimer readTcpDataTimer = new ReadTcpDataTimer(readData, this, tcpServer, tcpClient);
        if (oldTimerV2 != null) {
            logger.info(clientId+": closing old timer");
            breakRead = true;
            oldTimerV2.stop();
        }
        Timer timer = new Timer();
        timer.schedule(readTcpDataTimer, 0, 1000);
        oldTimerV2 = readTcpDataTimer;
        if (AppConstant.protocolByteWithTVL.equals(protocolConfig.getType())) {
            this.readWithTLV(inputStream);
        } else {
            this.readWithoutTLV(inputStream);
        }
    }
    public void readBytes(InputStream inputStream,
                            CapitalizationServer capitalizationServer,
                            CapitalizationClient capitalizationClient,
                            InterceptorServer interceptorServer,
                            InterceptorClient interceptorClient,
                            Interceptor interceptor) {
        ReadData readData = new ReadData();
        ReadCharDataTimer readCharDataTimer = new ReadCharDataTimer(readData, this,
                capitalizationServer, capitalizationClient, interceptorServer, interceptorClient, interceptor);
        if (oldTimer != null) {
            logger.info(clientId+": closing old timer");
            breakRead = true;
            oldTimer.stop();
        }
        Timer timer = new Timer();
        timer.schedule(readCharDataTimer, 0, 1000);
        oldTimer = readCharDataTimer;
        try {
            BufferedInputStream buf = new BufferedInputStream(inputStream);
            DataInputStream dataInputStream = new DataInputStream(buf);
            int dataIn = dataInputStream.readByte();
//            logger.info("dataIn1:"+byteData);
            while (dataIn > 0) {
                byteData += (char)dataIn;
                dataIn = dataInputStream.readByte();
//                logger.info("dataIn2:"+byteData);
                if (breakRead) {
                    logger.info("breaking from loop");
                    break;
                }
            }
            breakRead = false;
        } catch (IOException e) {
            logger.info(clientId+": Error in reading input");
            e.printStackTrace();
        }
    }
}
