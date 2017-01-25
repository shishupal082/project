package socketClient;

import javax.swing.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

/**
 * Created by shishupalkumar on 12/08/16.
 */
public class CapitalizationClient {
    private BufferedReader systemIn;
    private CapitalizationClient() {
        systemIn = new BufferedReader(new InputStreamReader(System.in));
    }
    private void connectToServer(String[] args) throws IOException {
        String ip = "127.0.0.1";
        Integer port = 8080;
        if (args.length >= 2) {
            ip = args[0];
            port = Integer.parseInt(args[1]);
        }
        Socket socket = new Socket(ip, port);
        PrintWriter socketOut = new PrintWriter(socket.getOutputStream(), true);
        BufferedReader socketIn = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        //read Socket welcome message.
        System.out.println(socketIn.readLine());

        System.out.print("Enter string 1 : ");
        String userInput = systemIn.readLine();
        socketOut.println(userInput);
        System.out.println("Socket output : " + socketIn.readLine());

        System.out.print("Enter string 2 : ");
        userInput = systemIn.readLine();
        socketOut.println(userInput);
        System.out.println("Socket output : " + socketIn.readLine());

        socketOut.println("Dummy Input String.");
        System.out.println("Socket output : " + socketIn.readLine());

        System.out.print("Enter string 3 : ");
        userInput = systemIn.readLine();
        socketOut.println(userInput);
        System.out.println("Socket output : " + socketIn.readLine());
    }
    /**
     * Runs the client application.
     */
    public static void main(String[] args) throws Exception {
        CapitalizationClient client = new CapitalizationClient();
        client.connectToServer(args);
    }
}
