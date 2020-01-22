import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.Socket;
/**
 * Created by shishupalkumar on 10/12/18.
 */

public class DateClient {
    public static void main(String[] args) throws IOException {
        String ip = "127.0.0.1";
        Integer port = 8080;
        if (args.length >= 2) {
            ip = args[0];
            port = Integer.parseInt(args[1]);
        }
        Socket socket = new Socket(ip, port);
        BufferedReader socketIn =
            new BufferedReader(new InputStreamReader(socket.getInputStream()));
        System.out.println(socketIn.readLine());
        socket.close();
        System.exit(0);
    }
}
