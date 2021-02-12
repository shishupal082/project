package com.project.communication.capitalization;

import com.project.communication.obj.ProtocolConfig;

import java.io.*;
import java.net.Socket;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;

public class ServerThreadBcp extends Thread {
    private final Socket socket;
    private final int clientId;
    private final ProtocolConfig protocolConfig;
    public ServerThreadBcp(ProtocolConfig protocolConfig, int clientId, Socket socket) throws IOException {
        this.protocolConfig = protocolConfig;
        this.clientId = clientId;
        this.socket = socket;
    }
    private void handleLineRequest(InputStream input) {
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(input));
            OutputStream output = socket.getOutputStream();
            PrintWriter writer = new PrintWriter(output, true);
            String text;
            do {
                text = reader.readLine();
                String reverseText = new StringBuilder(text).reverse().toString();
                writer.println("Server: " + reverseText);
                System.out.println(clientId+": input="+text+", output="+reverseText);
            } while (!text.equals("bye"));
            socket.close();
        } catch (IOException ex) {
            System.out.println("Server exception handleLineRequest: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
    public void handleCharRequest(InputStream input) {
        try {
            InputStreamReader reader = new InputStreamReader(input);
            int character = reader.read(); // reads a single character
            OutputStream output = socket.getOutputStream();
            PrintWriter writer = new PrintWriter(output, true);
            while (character > 0) {
                character = reader.read();
                writer.println("Server: " + character);
                System.out.println(clientId+": input="+character);
                if (character == 48) {
                    System.out.println("0 detected: closing connection");
                    break;
                }
            }
        } catch (IOException ex) {
            System.out.println("Server exception handleCharRequest: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
    private void handleByteRequest(InputStream inputStream) {
        try {
            BufferedInputStream inBuf = new BufferedInputStream(inputStream);
            DataInputStream dataInputStream = new DataInputStream(inBuf);
            OutputStream outToServer = socket.getOutputStream();
            DataOutputStream dataOutputStream = new DataOutputStream(outToServer);
            String parsedRequest = "";
            int dataIn = dataInputStream.readByte();
            while(dataIn > 0) {
                parsedRequest += (char) dataIn;
                dataIn = dataInputStream.readByte();
                System.out.println(clientId+": input "+parsedRequest);
                dataOutputStream.writeBytes("Out"+parsedRequest);
//                dataOutputStream.write(parsedRequest.getBytes(AppConstant.UTF_8));
                parsedRequest = "";
            }
        } catch (IOException ex) {
            System.out.println("Server exception handleCharRequest: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
    private void handleByteRequestV2(InputStream inputStream) {
        try {
            DataInputStream in = new DataInputStream(inputStream);
            int bytesRead = 0;
            boolean end = false;
            String dataString = "";
            byte[] messageByte = new byte[1000];
            messageByte[0] = in.readByte();
            messageByte[1] = in.readByte();
            ByteBuffer byteBuffer = ByteBuffer.wrap(messageByte, 0, 2);

            int bytesToRead = byteBuffer.getShort();
            System.out.println("About to read " + bytesToRead + " octets");

            //The following code shows in detail how to read from a TCP socket

            while(!end)
            {
                bytesRead = in.read(messageByte);
                dataString += new String(messageByte, 0, bytesRead);
                if (dataString.length() == bytesToRead-2)
                {
                    end = true;
                }
            }
            System.out.println("MESSAGE 2: " + dataString);
        } catch (IOException ex) {
            System.out.println("Server exception handleCharRequest: " + ex.getMessage());
            ex.printStackTrace();
        }

    }
    private void handleByteRequestV3(InputStream inputStream) {
        try {
            DataInputStream in = new DataInputStream(inputStream);
            //TLV: Type, Length, Value
            int dataType = in.readChar();//233
            int length = in.readInt();//256
            System.out.println("0:dataType:"+dataType+",length="+length);
            byte[] messageByte = new byte[length];
            boolean end = false;
            StringBuilder dataString = new StringBuilder(length);
            int totalBytesRead = 0;
            while(!end) {
                System.out.println("Looping");
                int currentBytesRead = in.read(messageByte);
                System.out.println("Read");
                totalBytesRead = currentBytesRead + totalBytesRead;
                if(totalBytesRead <= length) {
                    System.out.println("1");
                    dataString.append(new String(messageByte, 0, currentBytesRead, StandardCharsets.UTF_8));
                } else {
                    System.out.println("2");
                    dataString
                            .append(new String(messageByte, 0, length - totalBytesRead + currentBytesRead,
                                    StandardCharsets.UTF_8));
                }
                System.out.println("3:"+dataString);
                System.out.println("4:"+dataString.length()+"::"+length);
                if(dataString.length()>=length) {
                    end = true;
                }
                System.out.println("5:"+dataString);
            }
        } catch (IOException ex) {
            System.out.println("Server exception handleCharRequest: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
    private void handleByteRequestV4(InputStream inputStream) {
        try {
            DataInputStream in = new DataInputStream(inputStream);
            //TLV: Type, Length, Value
            int dataType = in.readChar();//233
            int length = in.readInt();//256
            System.out.println("0:dataType:"+dataType+",length="+length);
            byte[] messageByte = new byte[length];
            boolean end = false;
            StringBuilder dataString = new StringBuilder(length);
            int totalBytesRead = 0;
            while(!end) {
                System.out.println("Looping");
                int currentBytesRead = in.read(messageByte);
                System.out.println("Read");
                totalBytesRead = currentBytesRead + totalBytesRead;
                if(totalBytesRead <= length) {
                    System.out.println("1");
                    dataString.append(new String(messageByte, 0, currentBytesRead, StandardCharsets.UTF_8));
                } else {
                    System.out.println("2");
                    dataString
                            .append(new String(messageByte, 0, length - totalBytesRead + currentBytesRead,
                                    StandardCharsets.UTF_8));
                }
                System.out.println("3:"+dataString);
                System.out.println("4:"+dataString.length()+"::"+length);
                if(dataString.length()>=length) {
                    end = true;
                }
                System.out.println("5:"+dataString);
            }
        } catch (IOException ex) {
            System.out.println("Server exception handleCharRequest: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
    public void run() {
        new ServerProgram(protocolConfig, clientId, socket).start();
    }
}
