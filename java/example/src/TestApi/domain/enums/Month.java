package TestApi.domain.enums;

/**
 * Created by shishupal.kumar on 19/03/16.
 */
public enum Month {
	JAN(1, "JANUARY"),
	FEB(2, "FEBRUARY"),
	MAR(3, "MARCH"),
	APR(4, "APRIL"),
	MAY(5, "MAY"),
	JUN(6, "JUNE"),
	JUL(7, "JULY"),
	AUG(8, "AUGUST"),
	SEP(9, "SEPTEMBER"),
	OCT(10, "OCTOBER"),
	NOV(11, "NOVEMBER"),
	DEC(12, "DECEMBER");

	private Integer value;
	private String fullName;
	Month(Integer value, String fullName) {
		this.value = value;
		this.fullName = fullName;
	}

	public Integer getValue() {
		return value;
	}

	public String getFullName() {
		return fullName;
	}
}
