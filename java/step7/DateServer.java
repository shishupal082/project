// package socketServer;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Date;

/**
 * Created by shishupalkumar on 12/08/16.
 */
public class DateServer {
    public static void main(String[] args) throws IOException {
        Integer i = 0;
        Integer port = 8080;
        if (args.length >= 1) {
            port = Integer.parseInt(args[0]);
        }
        ServerSocket listener = new ServerSocket(port);
        try {
            while (true) {
                if (i == 0) {
                    System.out.println("Date server stared #" + port);
                }
                Socket socket = listener.accept();
                try {
                    PrintWriter out =
                        new PrintWriter(socket.getOutputStream(), true);
                    String date = new Date().toString();
                    out.println(date);
                    System.out.println(date);
                } finally {
                    System.out.println("Request #" + i + " Completed.");
                    socket.close();
                }
                i++;
            }
        }
        finally {
            System.out.println("Date server closed #" + port);
            listener.close();
        }
    }
}
