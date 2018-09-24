
/**
 * Created by shishupalkumar on 24/09/18.
 */

import java.text.SimpleDateFormat;  
import java.util.Date; 
public class DateTime {  
	public static void main(String[] args) {  
	    SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");  
	    Date date = new Date();  
	    System.out.println(formatter.format(date));  
	}
}  