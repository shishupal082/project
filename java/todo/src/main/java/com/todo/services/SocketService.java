package com.todo.services;

import com.todo.constants.AppConstant;
import com.todo.utils.ErrorCodes;
import com.todo.utils.StringUtils;
import com.todo.common.TodoException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.StringTokenizer;

public class SocketService {
	private static Logger LOGGER = LoggerFactory.getLogger(SocketService.class);
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
		LOGGER.info("parsedRequest : {}", parsedRequest);
		if (parsedRequest.size() < 3) {
			LOGGER.info("getSocketResponse : throw : TodoException : {}", ErrorCodes.INVALID_QUERY_PARAMS);
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
		LOGGER.info("Final response : {}", response);
		return response;
	}
	private Map<String, String> getTcpConfigByName(final String name, final Map<String, String> tcpIpConfig) {
		Map<String, String> response = new HashMap<String, String>();
		response.put(AppConstant.STATUS, AppConstant.FAILURE);
		String tcpConfig;
		String[] tcpConfigParam;
		try {
			tcpConfig = tcpIpConfig.get(name);
			if (tcpConfig != null) {
				tcpConfigParam = tcpConfig.split(":");
				if (tcpConfigParam.length >= 2) {
					response.put(AppConstant.IP, tcpConfigParam[0]);
					response.put(AppConstant.PORT, tcpConfigParam[1]);
					response.put(AppConstant.STATUS, AppConstant.SUCCESS);
					LOGGER.info("TcpIpConfig for name : {} --> {}:{}",
							StringUtils.getLoggerObject(name, tcpConfigParam[0], tcpConfigParam[1]));
				} else {
					LOGGER.info(ErrorCodes.INVALID_QUERY_PARAMS.getErrorString());
					throw new TodoException(ErrorCodes.INVALID_QUERY_PARAMS);
				}
			} else {
				LOGGER.info(ErrorCodes.INVALID_QUERY_PARAMS.getErrorString());
				throw new TodoException(ErrorCodes.INVALID_QUERY_PARAMS);
			}
		} catch (Exception e) {
			LOGGER.info("Invalid name: {} --> for tcpIpConfig: {}", name, tcpIpConfig);
		}
		return response;
	}

	public String getSocketResponseV2(Map<String, String> tcpIpConfig, String serviceName, String query) throws TodoException {
		if (query == null || query.equals("")) {
			LOGGER.info("getSocketResponseV2 : throw : TodoException : {}", ErrorCodes.INVALID_QUERY_PARAMS);
			throw new TodoException(ErrorCodes.INVALID_QUERY_PARAMS);
		}
		if (serviceName == null || serviceName.equals("")) {
			LOGGER.info("getSocketResponseV2 : throw : TodoException : {}", ErrorCodes.INVALID_SERVICE_NAME_EMPTY);
			throw new TodoException(ErrorCodes.INVALID_SERVICE_NAME_EMPTY);
		}
		Map<String, String> socketParam = getTcpConfigByName(serviceName, tcpIpConfig);
		if (socketParam.get(AppConstant.STATUS).equals(AppConstant.FAILURE)) {
			LOGGER.info("getSocketResponseV2 : throw : TodoException : {}: {}", serviceName ,ErrorCodes.INVALID_SERVICE_NAME);
			throw new TodoException(ErrorCodes.INVALID_SERVICE_NAME);
		}
		ArrayList<String> parsedRequest = this.parseRequest(query);
		String socketName = socketParam.get(AppConstant.IP);
		Integer port = Integer.parseInt(socketParam.get(AppConstant.PORT));
		SocketClient socketClient = new SocketClient(socketName, port);

		String response = "";
		for (int i=2; i <= parsedRequest.size()-1; i++) {
			response += socketClient.callServer(parsedRequest.get(i));
			if (i != parsedRequest.size()-1) {
				response += requestDelimiter;
			}
		}
		socketClient.close();
		LOGGER.info("Final response : {}", response);
		return response;
	}
}
