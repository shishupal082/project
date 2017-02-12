package com.todo.services;

import com.todo.utils.ErrorCodes;
import com.todo.utils.TodoException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.StringTokenizer;

public class SocketService {
	private static Logger logger = LoggerFactory.getLogger(SocketService.class);
	private String requestDelimiter;
	public SocketService(String requestDelimiter) {
		this.requestDelimiter = requestDelimiter;
	}
	private ArrayList<String> parseRequest(String request) {
		ArrayList<String> parseRequest = new ArrayList<String>();
		StringTokenizer st = new StringTokenizer(request, requestDelimiter);
		while (st.hasMoreElements()) {
			parseRequest.add((String)st.nextElement());
        }
		return parseRequest;
	}
	public String getSocketResponse(String request) throws TodoException {
		ArrayList<String> parsedRequest = this.parseRequest(request);
		logger.info("parsedRequest : {}", parsedRequest);
		if (parsedRequest.size() < 3) {
			logger.info("getSocketResponse : throw : TodoException : {}", ErrorCodes.INVALID_QUERY_PARAMS);
			throw new TodoException(ErrorCodes.INVALID_QUERY_PARAMS);
		}
		String socketName = parsedRequest.get(0);
		Integer port = Integer.parseInt(parsedRequest.get(1));
		SocketClient socketClient = new SocketClient(socketName, port);
		
		String response = socketName + requestDelimiter + port + requestDelimiter;
		for (int i=2; i <= parsedRequest.size()-1; i++) {
			response += socketClient.callServer(parsedRequest.get(i));
			if (i != parsedRequest.size()-1) {
				response += requestDelimiter;
			}
		}
		socketClient.close();
		logger.info("Final response : {}", response);
		return response;
	}
}
