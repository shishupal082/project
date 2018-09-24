
/**
 * Created by shishupalkumar on 24/09/18.
 */

import java.text.SimpleDateFormat;  
import java.util.Date; 

class DateTime {
	private Date currentDateTime;
	private String currentDateTimeFormat;
	public DateTime(String dateTimeFormate) {
		this.currentDateTimeFormat = dateTimeFormate;
		this.setCurrentDateTime();
	}
	private void setCurrentDateTime() {
	    currentDateTime = new Date();
	}
	public String getCurrentDateTime() {
		SimpleDateFormat formatter = new SimpleDateFormat(this.currentDateTimeFormat);  
		return formatter.format(currentDateTime);
	}
}