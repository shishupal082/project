package com.todo.config;

import com.todo.utils.IpAddress;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by shishupalkumar on 21/08/17.
 */
public class ClientDetails {
    private String ip;
    public ClientDetails(HttpServletRequest httpServletRequest) {
        this.ip = IpAddress.getClientIpAddr(httpServletRequest);
    }
    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    @Override
    public String toString() {
        return "ClientDetails{" +
            "ip='" + ip + '\'' +
            '}';
    }
}
