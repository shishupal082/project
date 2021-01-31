package com.project.communication.obj;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;

@JsonIgnoreProperties(ignoreUnknown = true)

public class ProtocolConfig {
    private String name;
    private String application;
    private String type;
    private int clientPort;
    private int serverPort;
    private String serverIp;
    private ArrayList<String> welcomeMessage;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getApplication() {
        return application;
    }

    public void setApplication(String application) {
        this.application = application;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getClientPort() {
        return clientPort;
    }

    public void setClientPort(int clientPort) {
        this.clientPort = clientPort;
    }

    public int getServerPort() {
        return serverPort;
    }

    public void setServerPort(int serverPort) {
        this.serverPort = serverPort;
    }

    public String getServerIp() {
        return serverIp;
    }

    public void setServerIp(String serverIp) {
        this.serverIp = serverIp;
    }

    public ArrayList<String> getWelcomeMessage() {
        return welcomeMessage;
    }

    public void setWelcomeMessage(ArrayList<String> welcomeMessage) {
        this.welcomeMessage = welcomeMessage;
    }

    @Override
    public String toString() {
        return "ProtocolConfig{" +
                "name='" + name + '\'' +
                ", application='" + application + '\'' +
                ", type='" + type + '\'' +
                ", clientPort=" + clientPort +
                ", serverPort=" + serverPort +
                ", serverIp='" + serverIp + '\'' +
                ", welcomeMessage=" + welcomeMessage +
                '}';
    }
}
