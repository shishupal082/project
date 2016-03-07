package com.test.domain;

import lombok.Data;

/**
 * Created by shishupal.kumar on 07/03/16.
 */
@Data
public class UserAgentInfo {
	private String userAgentString;
	private String osName;
	private String browserName;
	private String deviceType; //Computer, Mobile ...

	//Derived parameters
	private String osType;
	private boolean mobile;
}
