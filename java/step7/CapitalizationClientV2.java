// package socketServer;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.StringTokenizer;

import java.io.*;
import java.net.*;
import java.util.StringTokenizer;

/**
 * Created by shishupalkumar on 12/08/16.
 */

public class CapitalizationClientV2 {
    private Socket client = null;
    public CapitalizationClientV2(String serverName, Integer port) {
        System.out.println("trying to connect to " + serverName + " on port " + port);
        try {
            client = new Socket();
            client.connect(new InetSocketAddress(serverName, port), 10000);
            System.out.println("Socket connection success on " + serverName + ":" + port);
        } catch (Exception e) {
            System.out.println("Socket connection error on " + serverName + ":" + port);
        }
    }
    public void close() {
        try {
            client.close();
            System.out.println("Client closed.");
        } catch (Exception e) {
            System.out.println("Exception while closing client.");
        }
    }
    private String getResponse() throws IOException {
        InputStream inFromServer = client.getInputStream();
        BufferedInputStream buf = new BufferedInputStream(inFromServer);
        DataInputStream dataInputStream = new DataInputStream(buf);
        String parsedResponse = "";
        int dataIn = dataInputStream.readByte();
        while(dataIn > 0) {
            parsedResponse += (char)dataIn;
            StringTokenizer st = new StringTokenizer(parsedResponse, "|");
            Boolean isResponseEnd = false;
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
            dataIn = dataInputStream.readByte();
        }
        return parsedResponse;
    }
    public String callServer(String request) {
        String response = null;
        try {
            if (client.isConnected()) {
                System.out.println("Connected to : " + client.getRemoteSocketAddress());
                OutputStream outToServer = client.getOutputStream();
                DataOutputStream out = new DataOutputStream(outToServer);
                System.out.println("Send request : " + request + "::length=" + request.length());
//              out.writeBytes(request);
                out.write(request.getBytes("UTF-8"));
                response = this.getResponse();
                System.out.println("Response : " + response + "::length=" + response.length());
            } else {
                System.out.println("Socket connection failed.");
            }
        } catch (SocketTimeoutException s) {
            System.out.println("Socket timed out.");
        } catch (ConnectException ex) {
            System.out.println("Error while connecting to server.");
        } catch (InterruptedIOException interruptedIOException) {
            System.out.println("InterruptedIOException.");
        } catch(IOException ioe) {
            System.out.println("IOE.");
        } catch (Exception e) {
            System.out.println("Unhandled exception.");
        }
        return response;
    }
    public static void main(String[] args) throws Exception {
        String hostname = "127.0.0.1";
        Integer port = 9080;
        CapitalizationClientV2 clientV2 = new CapitalizationClientV2(hostname, port);
        client.connectServer("args|END");
    }
}
