package TestApi.utils;

import TestApi.domain.UserAgentInfo;
//import com.test.domain.UserAgentInfo;
//import eu.bitwalker.useragentutils.UserAgent;
//import lombok.extern.slf4j.Slf4j;

//import javax.servlet.http.HttpServletRequest;

/**
 * Created by shishupal.kumar on 07/03/16.
 */
public class UserAgentUtils {
	public static UserAgentInfo getUserAgent(String userAgentString){
		UserAgentInfo userAgentInfo = new UserAgentInfo();
//		if(httpServletRequest == null){
//			log.error("UserAgentUtils : getUserAgent : Invalid httpServletRequest.");
//			return userAgentInfo;
//		}
//		String userAgentString = httpServletRequest.getHeader("User-Agent");
//		UserAgent userAgent = UserAgent.parseUserAgentString(userAgentString);
//		userAgentInfo.setUserAgentString(userAgentString);
//		userAgentInfo.setBrowserName(userAgent.getBrowser().getName());
//		userAgentInfo.setOsName(userAgent.getOperatingSystem().getName());
//		userAgentInfo.setDeviceType(userAgent.getOperatingSystem().getDeviceType().getName());
//
//		if (userAgentInfo.getDeviceType() == null){
//			userAgentInfo.setMobile(false);
//		} else {
//			userAgentInfo.setMobile(userAgentInfo.getDeviceType().equalsIgnoreCase("mobile"));
//		}
//
//		String osName = userAgentInfo.getOsName();
//		if (osName == null){
//			userAgentInfo.setOsType("");
//		} else if (osName.contains("Android")) {
//			userAgentInfo.setOsType("android");
//		} else if (osName.contains("Windows")) {
//			userAgentInfo.setOsType("windows");
//		} else if (osName.contains("iOS")) {
//			userAgentInfo.setOsType("ios");
//		} else {
//			userAgentInfo.setOsType("unknown");
//		}

		return userAgentInfo;
	}
}
