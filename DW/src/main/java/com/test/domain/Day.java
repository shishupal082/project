package com.test.domain;

/**
 * Created by shishupal.kumar on 19/03/16.
 */
public enum Day {
	MON(0, "MONDAY"),
	TUE(1, "TUESDAY"),
	WED(2, "WEDNESDAY"),
	THU(3, "THRUSDAY"),
	FRI(4, "FRIDAY"),
	SAT(5, "SATURDAY"),
	SUN(6, "SUNDAY");

	private Integer index;
	private String fullName;

	Day(Integer value, String fullName) {
		this.index = value;
		this.fullName = fullName;
	}

	public Integer getIndex() {
		return index;
	}

	public String getFullName() {
		return fullName;
	}
}
