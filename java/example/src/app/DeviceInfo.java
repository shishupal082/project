package app;

import java.net.InetAddress;
import java.util.ArrayList;

/**
 * Created by shishupalkumar on 23/11/16.
 */
public class DeviceInfo {
    private static String format(String str) {
        String str2 = "000";
        if (str.length() < 2) {
            str2 = "00" + str;
        } else if(str.length() < 3) {
            str2 = "0" + str;
        } else {
            str2 = str;
        }
        return str2;
    }
    public static void main(String[] args) throws Exception {
        ArrayList<String> knownIps = new ArrayList<String>();
        String ipPrefix = "192.168.43.";
        ipPrefix = "192.168.1.";
        for (int i=2; i<255; i++) {
            String ip = String.valueOf(i);
            System.out.println("Scaning : " + ip);
            try {
                InetAddress inetAddr = InetAddress.getByName(ipPrefix + ip);
                if (inetAddr.isReachable(500)) {
                    knownIps.add(format(ip) + " : " + inetAddr.getHostName());
                    System.out.println(format(ip) + " : " + inetAddr.getHostName());
                }
            } catch (Exception e) {
                System.out.println("Catch : " + ip);
                System.out.println(e);
            }
        }
        System.out.println("*****====================*****");
        for (String info : knownIps) {
            System.out.println(info);
        }
    }

    public static void main2(String[] args) throws Exception {
        ArrayList<String> knownIps = new ArrayList<String>();
        String ipPrefix = "192.168.43.";
        ipPrefix = "192.168.1.";
        String ip = String.valueOf(3);
        InetAddress inetAddr = InetAddress.getByName(ipPrefix + ip);
        if (inetAddr.isReachable(500)) {
            knownIps.add(format(ip) + " : " + inetAddr.getHostName());
            System.out.println(format(ip) + " : " + inetAddr.getHostName());
        }
        System.out.println(inetAddr.getHostAddress());
    }
}
