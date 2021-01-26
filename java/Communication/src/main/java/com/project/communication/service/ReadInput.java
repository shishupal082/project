package com.project.communication.service;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;

import java.io.*;
import java.util.StringTokenizer;

public class ReadInput {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(ReadInput.class);
    private final static BufferedReader systemIn = new BufferedReader(new InputStreamReader(System.in));;
    public ReadInput() {}
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
        String text = "";
        try {
            return systemIn.readLine();
        } catch (IOException e) {
            logger.info("IOException for reading command line");
        }
        return text;
    }
    public static String readBytes(int clientId, InputStream inputStream) {
        String result = null;
        try {
            BufferedInputStream buf = new BufferedInputStream(inputStream);
            DataInputStream dataInputStream = new DataInputStream(buf);
            String parsedResponse = "";
            int dataIn = dataInputStream.readByte();
            while(dataIn > 0) {
                parsedResponse += (char)dataIn;
                StringTokenizer st = new StringTokenizer(parsedResponse, "|");
                boolean isResponseEnd = false;
                while (st.hasMoreElements()) {
                    if (st.nextElement().equals("END")) {
                        isResponseEnd = true;
                        while (dataInputStream.available() > 0) {
                            dataInputStream.readByte();
                        }
                        break;
                    }
                }
                if (isResponseEnd) {
                    break;
                }
                dataIn = dataInputStream.read();
            }
            result = parsedResponse;
        } catch (IOException e) {
            logger.info(clientId+": Error in reading input");
        }
        return result;
    }
}
