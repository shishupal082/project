package com.project.communication.client;// package socketClient;

import com.project.communication.obj.RunTimeArg;

import java.io.*;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.util.StringTokenizer;

/**
 * Created by shishupalkumar on 12/08/16.
 */
public class CapitalizationClient {
    private final BufferedReader systemIn;
    private final String protocol;
    private Socket socket;
    private CapitalizationClient(String protocol) {
        this.protocol = protocol;
        systemIn = new BufferedReader(new InputStreamReader(System.in));
    }
    private String getResponse() throws IOException {
        String response;
        if (protocol.equals("byte")) {
            InputStream inFromServer = socket.getInputStream();
            BufferedInputStream buf = new BufferedInputStream(inFromServer);
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
            response = parsedResponse;
        } else {
            BufferedReader socketIn = new BufferedReader(
                new InputStreamReader(socket.getInputStream()));
            response = socketIn.readLine();
        }
        System.out.println("Response : " + response);
        return response;
    }
    private void sendRequest(String request) throws IOException {
        String charsetName = "UTF-8";
        System.out.println("Request : " + request);
        if (protocol.equals("byte")) {
            OutputStream outToServer = socket.getOutputStream();
            DataOutputStream dataOutputStream = new DataOutputStream(outToServer);
            request += "|END";
//            dataOutputStream.writeBytes(request);
            dataOutputStream.write(request.getBytes(charsetName));
        } else {
            PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
            out.println(request);
        }
    }
    private void startCommunication() throws IOException{
//        System.out.println(getResponse());
        System.out.print("Enter string 1 : ");
        String userInput = systemIn.readLine();
        sendRequest(userInput);
        System.out.println("Socket output : " + getResponse());

        System.out.print("Enter string 2 : ");
        userInput = systemIn.readLine();
        sendRequest(userInput);
        System.out.println("Socket output : " + getResponse());

        sendRequest("Dummy Input String.");
        System.out.println("Socket output : " + getResponse());

        System.out.print("Enter string 3 : ");
        userInput = systemIn.readLine();
        sendRequest(userInput);
        System.out.println("Socket output : " + getResponse());
    }
    private void connectToServer(String ip, int port) throws IOException {
        socket = new Socket();
        socket.connect(new InetSocketAddress(ip, port), 10000);

        this.startCommunication();
        socket.close();
    }
    /**
     * Runs the client application.
     */
    public static void main(RunTimeArg runTimeArg) throws Exception {
        String protocol = runTimeArg.getProtocol();
        String ip = runTimeArg.getIp();
        int port = runTimeArg.getPort();
        CapitalizationClient client = new CapitalizationClient(protocol);
        client.connectToServer(ip, port);
    }
}
