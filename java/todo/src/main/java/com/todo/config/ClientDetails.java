package com.todo.config;

import com.todo.constants.AppConstant;
import com.todo.utils.IpAddress;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by shishupalkumar on 21/08/17.
 */
public class ClientDetails {
    private String ip;
    private String appVersion;
    public ClientDetails(HttpServletRequest httpServletRequest) {
        this.ip = IpAddress.getClientIpAddr(httpServletRequest);
        this.appVersion = AppConstant.AppVersion;
    }
    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getAppVersion() {
        return appVersion;
    }

    public void setAppVersion(String appVersion) {
        this.appVersion = appVersion;
    }

    @Override
    public String toString() {
        return "ClientDetails{" +
                "ip='" + ip + '\'' +
                ", appVersion='" + appVersion + '\'' +
                '}';
    }
}
