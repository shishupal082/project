package com.project.communication.service;

import com.project.communication.capitalization.CapitalizationClient;
import com.project.communication.capitalization.CapitalizationServer;
import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.obj.ReadCharDataTimer;
import com.project.communication.obj.ReadData;

import java.io.*;
import java.util.Timer;

public class ReadInput {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(ReadInput.class);
    private final static BufferedReader systemIn = new BufferedReader(new InputStreamReader(System.in));;
    public String byteData = "";
    public boolean breakRead = false;
    public ReadCharDataTimer oldTimer = null;
    private final int clientId;
    private final int reference; // 1 for server, 2 for client
    public ReadInput(int clientId, int reference) {
        this.clientId = clientId;
        this.reference = reference;
    }
    public int getClientId() {
        return clientId;
    }
    public int getReference() {
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
    public static String readLine(InputStream inputStream) {
        String result = null;
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
            result = reader.readLine();
        } catch (IOException ex) {
            logger.info("I/O error: " + ex.getMessage());
        }
        return result;
    }
    public static String readCommandLine() {
        logger.info("Read command line");
        String text = "";
        try {
            return systemIn.readLine();
        } catch (IOException e) {
            logger.info("IOException for reading command line");
        }
        return text;
    }
    public String readBytes(InputStream inputStream,
                            CapitalizationServer capitalizationServer,
                            CapitalizationClient capitalizationClient) {
        ReadData readData = new ReadData();
        ReadCharDataTimer readCharDataTimer = new ReadCharDataTimer(readData, this,
                capitalizationServer, capitalizationClient);
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
        }
        return byteData;
    }
}
