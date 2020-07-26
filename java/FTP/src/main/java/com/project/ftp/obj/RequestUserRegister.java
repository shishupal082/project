package com.project.ftp.obj;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.ftp.service.StaticService;

@JsonIgnoreProperties(ignoreUnknown = true)

public class RequestUserRegister {
    @JsonProperty("username")
    private String username;
    @JsonProperty("passcode")
    private String passcode;
    @JsonProperty("password")
    private String password;
    @JsonProperty("display_name")
    private String display_name;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasscode() {
        return passcode;
    }

    public void setPasscode(String passcode) {
        this.passcode = passcode;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getDisplay_name() {
        display_name = StaticService.replaceChar(display_name, ",", "..");
        return display_name;
    }

    public void setDisplay_name(String display_name) {
        this.display_name = display_name;
    }

    @Override
    public String toString() {
        return "RequestUserRegister{" +
                "username='" + username + '\'' +
                ", passcode='" + passcode + '\'' +
                ", password='" + "*****" + '\'' +
                ", display_name='" + display_name + '\'' +
                '}';
    }
}
