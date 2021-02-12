package com.project.communication.service;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;

import java.io.*;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

public class ReadInputBcp {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(ReadInputBcp.class);
    private final static BufferedReader systemIn = new BufferedReader(new InputStreamReader(System.in));;
    public ReadInputBcp() {}
    public static String readInput(InputStream inputStream) {
        try {
            DataInputStream in = new DataInputStream(inputStream);
            //TLV: Type, Length, Value
            int dataType = in.readChar();//233
            int length = in.readInt();//256
            logger.info("0:dataType:" + dataType + ",length=" + length);
            byte[] messageByte = new byte[length];
            boolean end = false;
            StringBuilder dataString = new StringBuilder(length);
            int totalBytesRead = 0;
            while (!end) {
                logger.info("Looping");
                int currentBytesRead = in.read(messageByte);
                logger.info("Read");
                logger.info(currentBytesRead);
                logger.info(totalBytesRead);
                totalBytesRead = currentBytesRead + totalBytesRead;
                if (totalBytesRead <= length) {
                    logger.info("1");
                    dataString.append(new String(messageByte, 0, currentBytesRead, StandardCharsets.UTF_8));
                } else {
                    logger.info("2");
                    dataString
                            .append(new String(messageByte, 0, length - totalBytesRead + currentBytesRead,
                                    StandardCharsets.UTF_8));
                }
                logger.info("3:");
                logger.info(dataString);
                logger.info("4:" + dataString.length() + "::" + length);
                if (dataString.length() >= length) {
                    end = true;
                }
                logger.info("5:");
                logger.info(dataString);
//                outputStream.write((byte) dataType);
//                outputStream.write(length);
//                outputStream.write(messageByte);
//                ReadInput.readInputV2(inputStream, outputStream);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
    public static String readInputV2(InputStream inputStream, OutputStream outputStream) {
        try {
            DataInputStream in = new DataInputStream(inputStream);
            //TLV: Type, Length, Value
            int dataType = in.readChar();//233
            int length = in.readInt();//256
            logger.info("0:dataType:" + dataType + ",length=" + length);
            byte[] messageByte = new byte[length];
            boolean end = false;
            StringBuilder dataString = new StringBuilder(length);
            int totalBytesRead = 0;
            while (!end) {
                logger.info("Looping");
                int currentBytesRead = in.read(messageByte);
                logger.info("Read");
                logger.info(currentBytesRead);
                logger.info(totalBytesRead);
                totalBytesRead = currentBytesRead + totalBytesRead;
                if (totalBytesRead <= length) {
                    logger.info("1");
                    dataString.append(new String(messageByte, 0, currentBytesRead, StandardCharsets.UTF_8));
                } else {
                    logger.info("2");
                    dataString
                            .append(new String(messageByte, 0, length - totalBytesRead + currentBytesRead,
                                    StandardCharsets.UTF_8));
                }
                logger.info("3:");
                logger.info(dataString);
                logger.info("4:" + dataString.length() + "::" + length);
                if (dataString.length() >= length) {
                    end = true;
                }
                logger.info("5:");
                logger.info(dataString);
            }
        } catch (IOException e) {
            logger.info("Error in readInput.read");
            e.printStackTrace();
        }
        return null;
    }
    public static String read(Socket socket) {
        logger.info("Reading input");
        try {
            InputStream input = socket.getInputStream();
            DataInputStream in = new DataInputStream(input);
            //TLV: Type, Length, Value
            int dataType = in.readChar();//233
            int length = in.readInt();//256
            logger.info("0:dataType:"+dataType+",length="+length);
            byte[] messageByte = new byte[length];
            boolean end = false;
            StringBuilder dataString = new StringBuilder(length);
            int totalBytesRead = 0;
            while(!end) {
                logger.info("Looping");
                int currentBytesRead = in.read(messageByte);
                logger.info("Read");
                totalBytesRead = currentBytesRead + totalBytesRead;
                if(totalBytesRead <= length) {
                    logger.info("1");
                    dataString.append(new String(messageByte, 0, currentBytesRead, StandardCharsets.UTF_8));
                } else {
                    logger.info("2");
                    dataString
                            .append(new String(messageByte, 0, length - totalBytesRead + currentBytesRead,
                                    StandardCharsets.UTF_8));
                }
                logger.info("3:"+dataString);
                logger.info("4:"+dataString.length()+"::"+length);
                if(dataString.length()>=length) {
                    end = true;
                }
                logger.info("5:"+dataString);
            }
        } catch (IOException ex) {
            logger.info("Error in read input: " + ex.getMessage());
            ex.printStackTrace();
        }
        return "";
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
        String text = "";
        try {
            return systemIn.readLine();
        } catch (IOException e) {
            logger.info("IOException for reading command line");
        }
        return text;
    }
}
