package socketServer;

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
    public static void main(String[] args) throws Exception {
        String protocol = "byte";
        System.out.println("The capitalization server is running with protocol : " + protocol);
        int clientNumber = 0;
        Integer port = 8000;
        if (args.length >= 1) {
            port = Integer.parseInt(args[0]);
        }
        ServerSocket listener = new ServerSocket(port);
        try {
            while (true) {
                new Capitalizer(listener.accept(), clientNumber++, protocol).start();
            }
        } finally {
            listener.close();
        }
    }

    /**
     * A private thread to handle capitalization requests on a particular
     * socket.  The client can communicate as long as they want.
     */
    private static class Capitalizer extends Thread {
        private Socket socket;
        private int clientNumber;
        private String protocol;

        public Capitalizer(Socket socket, int clientNumber, String protocol) throws IOException {
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
                    Boolean isRequestEnd = false;
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
            System.out.println(clientNumber + " : Response : " + response);
            if (protocol.equals("byte")) {
                response += "|END";
                OutputStream outToServer = socket.getOutputStream();
                DataOutputStream dataOutputStream = new DataOutputStream(outToServer);
                dataOutputStream.writeBytes(response);
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
