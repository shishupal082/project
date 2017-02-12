package com.todo.services;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.net.*;
import java.util.StringTokenizer;

public class SocketClient {
	private static Logger logger = LoggerFactory.getLogger(SocketClient.class);
	private Socket client = null;
	public SocketClient(String serverName, Integer port) {
		logger.info("trying to connect to {} on port : {}", serverName, port);
		try {
			client = new Socket();
	        client.connect(new InetSocketAddress(serverName, port), 10000);
		} catch (Exception e) {
			logger.info("Socket connection error : {}", e);
		}
	}
	public void close() {
		try {
			client.close();
			logger.info("Client closed.");
		} catch (Exception e) {
			logger.info("Exception while closing client : {}", e);
		}
	}
	private String getResponse() throws IOException {
		InputStream inFromServer = client.getInputStream();
		BufferedInputStream buf = new BufferedInputStream(inFromServer);
		DataInputStream dataInputStream = new DataInputStream(buf);
		String parsedResponse = "";
		int dataIn = dataInputStream.readByte();
		while(dataIn > 0) {
			parsedResponse += (char)dataIn;
			StringTokenizer st = new StringTokenizer(parsedResponse, "|");
			Boolean isResponseEnd = false;
			while (st.hasMoreElements()) {
				if (st.nextElement().equals("END")) {
					isResponseEnd = true;
					while (dataInputStream.available() > 0) {
						dataInputStream.readByte();
					}
					break;
				}
			}
			if (isResponseEnd) {
				break;
			}
			dataIn = dataInputStream.read();
		}
		return parsedResponse;
	}
	public String callServer(String request) {
		String response = null;
		try {
			if (client.isConnected()) {
				logger.info("Connected to : {}", client.getRemoteSocketAddress());
	            OutputStream outToServer = client.getOutputStream();
	            DataOutputStream out = new DataOutputStream(outToServer);
				logger.info("Send request : {}::length={}", request, request.length());
	            out.writeBytes(request);
	            response = this.getResponse();
				logger.info("Response : {}::length=", response, response.length());
			}
		} catch (SocketTimeoutException s) {
			logger.info("Socket timed out!");
	    } catch (ConnectException ex) {
			logger.info("Error while connecting to server: Exiting" + ex);
	    } catch (InterruptedIOException interruptedIOException) {
			logger.info("{}", interruptedIOException);
	    } catch(IOException ioe) {
			logger.info("IOE : {}", ioe);
	    } catch (Exception e) {
			logger.info("Unhandled exception : {}" , e);
		}
		return response;
	}
}
