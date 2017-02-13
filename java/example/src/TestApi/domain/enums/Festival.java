package TestApi.domain.enums;

/**
 * Created by shishupal.kumar on 19/03/16.
 */
public enum  Festival {
	Holi("Holi", 2016, Month.MAR, 23, Day.WED);
	private String festivalName;
	private Integer year;
	private Month month;
	private Integer date;
	private Day day;
	Festival(String festivalName, Integer year, Month month, Integer date, Day day) {
		this.festivalName = festivalName;
		this.year = year;
		this.month = month;
		this.date = date;
		this.day = day;
	}

	public String getFestivalName() {
		return festivalName;
	}

	public Integer getYear() {
		return year;
	}

	public Month getMonth() {
		return month;
	}

	public Integer getDate() {
		return date;
	}

	public Day getDay() {
		return day;
	}
}
