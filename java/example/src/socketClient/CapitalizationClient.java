package socketClient;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.util.StringTokenizer;

/**
 * Created by shishupalkumar on 12/08/16.
 */
public class CapitalizationClient {
    private BufferedReader systemIn;
    private String protocol = "byte";
    private Socket socket;
    private CapitalizationClient() {
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
        System.out.println("Request : " + request);
        if (protocol.equals("byte")) {
            OutputStream outToServer = socket.getOutputStream();
            DataOutputStream dataOutputStream = new DataOutputStream(outToServer);
            request += "|END";
//            dataOutputStream.writeBytes(request);
            dataOutputStream.write(request.getBytes("UTF-8"));
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
    private void connectToServer(String[] args) throws IOException {
        String ip = "127.0.0.1";
        Integer port = 8000;
        if (args.length >= 2) {
            ip = args[0];
            port = Integer.parseInt(args[1]);
        }
        socket = new Socket();
        socket.connect(new InetSocketAddress(ip, port), 10000);

        this.startCommunication();
        socket.close();
    }
    /**
     * Runs the client application.
     */
    public static void main(String[] args) throws Exception {
        CapitalizationClient client = new CapitalizationClient();
        client.connectToServer(args);
    }
}
