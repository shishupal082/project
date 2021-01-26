package com.project.communication.service;// package socketServer;

import com.project.communication.obj.RunTimeArg;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Date;
import java.util.StringTokenizer;

/**
 * Created by shishupalkumar on 12/08/16.
 */

public class CapitalizationServer {
    /**
     * Application method to run the server runs in an infinite loop
     * listening on port ****.  When a connection is requested, it
     * spawns a new thread to do the servicing and immediately returns
     * to listening.  The server keeps a unique client number for each
     * client that connects just to show interesting logging
     * messages.  It is certainly not necessary to do this.
     */
    public static void main(RunTimeArg runTimeArg) {
        String protocol = runTimeArg.getProtocol();
        int port = runTimeArg.getPort();

        System.out.println("The capitalization server is running with protocol: " +
                protocol + ", and port: " + port);
        int clientNumber = 0;
        int maxRequestCount = 50;
        int requestCount = 0;
        try {
            ServerSocket serverSocket = new ServerSocket(port);
//            Socket socket = listener.accept();
//            InputStream input = socket.getInputStream();
//            InputStreamReader readerChar = new InputStreamReader(input);
//            int character = readerChar.read();  // reads a single character
//            System.out.println(character);
//            BufferedReader readerLine = new BufferedReader(new InputStreamReader(input));
//            String line = readerLine.readLine();    // reads a line of text
//            System.out.println(line);
            /*while (requestCount < maxRequestCount) {
                new Capitalize(listener.accept(), clientNumber++, protocol).start();
                requestCount++;
            }*/
            while (true) {
                Socket socket = serverSocket.accept();

                System.out.println("New client connected");

                OutputStream output = socket.getOutputStream();
                PrintWriter writer = new PrintWriter(output, true);

                writer.println(new Date().toString());
            }
        } catch (Exception e) {
            System.out.println("Error in capitalize");
        }
    }

    /**
     * A private thread to handle capitalization requests on a particular
     * socket.  The client can communicate as long as they want.
     */
    private static class Capitalize extends Thread {
        private final Socket socket;
        private final int clientNumber;
        private final String protocol;

        public Capitalize(Socket socket, int clientNumber, String protocol) {
            this.socket = socket;
            this.clientNumber = clientNumber;
            this.protocol = protocol;
            System.out.println("New connection with client# " + clientNumber + " at " + socket);
        }
        private String getRequest() throws IOException {
            String request;
            if (protocol.equals("byte")) {
                InputStream inFromServer = socket.getInputStream();
                BufferedInputStream inBuf = new BufferedInputStream(inFromServer);
                DataInputStream dataInputStream = new DataInputStream(inBuf);
                String parsedRequest = "";
                int dataIn = dataInputStream.readByte();
                while(dataIn > 0) {
                    parsedRequest += (char) dataIn;
                    StringTokenizer st = new StringTokenizer(parsedRequest, "|");
                    boolean isRequestEnd = false;
                    while (st.hasMoreElements()) {
                        if (st.nextElement().equals("END")) {
                            isRequestEnd = true;
                            while (dataInputStream.available() > 0) {
                                dataInputStream.readByte();
                            }
                            break;
                        }
                    }
                    if (isRequestEnd) {
                        break;
                    }
                    dataIn = dataInputStream.read();
                }
                request = parsedRequest;
            } else {
                BufferedReader socketIn = new BufferedReader(
                    new InputStreamReader(socket.getInputStream()));
                request = socketIn.readLine();
            }
            System.out.println(clientNumber + " : Request : " + request);
            return request;
        }
        private void sendResponse(String response) throws IOException {
            String charsetName = "UTF-8";
            System.out.println(clientNumber + " : Response : " + response);
            if (protocol.equals("byte")) {
                response += "|END";
                OutputStream outToServer = socket.getOutputStream();
                DataOutputStream dataOutputStream = new DataOutputStream(outToServer);
//                dataOutputStream.writeBytes(response);
                dataOutputStream.write(response.getBytes(charsetName));
            } else {
                PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
                out.println(response);
            }
        }
        /**
         * Services this thread's client by first sending the
         * client a welcome message then repeatedly reading strings
         * and sending back the capitalized version of the string.
         */
        public void run() {
            try {
//                this.sendResponse("Hello, you are client #" + clientNumber + ".");
                while (true) {
                    String input = this.getRequest();
                    if (input == null || input.equals(".")) {
                        System.out.println(clientNumber + " : socketClosed");
                        this.sendResponse("socketClosed");
                        break;
                    }
                    System.out.println(clientNumber + " : Capitalizing... : " + input);
                    this.sendResponse(input.toUpperCase());
                }
            } catch (IOException e) {
                System.out.println("Error handling client# " + clientNumber + ": " + e);
            } finally {
                try {
                    socket.close();
                } catch (IOException e) {
                    System.out.println("Couldn't close a socket, what's going on? client# " + clientNumber);
                }
                System.out.println("Connection with client# " + clientNumber + " closed");
            }
        }
    }
}
