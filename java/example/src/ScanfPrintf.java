import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Scanner;

/**
 * Created by shishupalkumar on 30/12/16.
 */
public class ScanfPrintf {
    public static void main(String[] args) throws Exception {
        String str = null;
        System.out.print("Please enter string: ");
//        (1) This method is not working properly with IDE (Eclipse...) but working fine with command line
//        str = System.console().readLine();
//        (2) This method will not accept space in input string
//        Scanner scanner = new Scanner(System.in);
//        str = scanner.next();
//        (3) This will accept space in the input string
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        str = reader.readLine();
        System.out.println("String input is: " + str);
    }
}
