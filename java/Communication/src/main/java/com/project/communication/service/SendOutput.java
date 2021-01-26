package com.project.communication.service;

import java.io.OutputStream;
import java.io.PrintWriter;

public class SendOutput {
    public SendOutput() {}
    public static void sendLine(OutputStream outputStream, String text) {
        PrintWriter writer = new PrintWriter(outputStream, true);
        writer.println(text);
    }
}
