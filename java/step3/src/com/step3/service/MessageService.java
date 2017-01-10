package com.step3.service;

/**
 * Created by shishupalkumar on 10/01/17.
 */
public class MessageService {
    public MessageService() {}
    public String getStrMessage() {
        return "MessageService : getStrMessage : Hello World";
    }
    public static String getMessage() {
        return "MessageService : staticMethod : getMessage : Hello World";
    }
}
