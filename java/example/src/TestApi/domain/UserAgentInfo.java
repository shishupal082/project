package TestApi.domain;

/**
 * Created by shishupal.kumar on 07/03/16.
 */

public class UserAgentInfo {
	private String userAgentString;
	private String osName;
	private String browserName;
	private String deviceType; //Computer, Mobile ...

	//Derived parameters
	private String osType;
	private boolean mobile;

	public String getUserAgentString() {
		return userAgentString;
	}

	public void setUserAgentString(String userAgentString) {
		this.userAgentString = userAgentString;
	}

	public String getOsName() {
		return osName;
	}

	public void setOsName(String osName) {
		this.osName = osName;
	}

	public String getBrowserName() {
		return browserName;
	}

	public void setBrowserName(String browserName) {
		this.browserName = browserName;
	}

	public String getDeviceType() {
		return deviceType;
	}

	public void setDeviceType(String deviceType) {
		this.deviceType = deviceType;
	}

	public String getOsType() {
		return osType;
	}

	public void setOsType(String osType) {
		this.osType = osType;
	}

	public boolean isMobile() {
		return mobile;
	}

	public void setMobile(boolean mobile) {
		this.mobile = mobile;
	}
}
