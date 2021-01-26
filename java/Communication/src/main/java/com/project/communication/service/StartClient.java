package com.project.communication.service;

import com.project.communication.capitalization.SingleThreadedCapitalizationClient;
import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppConstant;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.time.TimeClient;

public class StartClient {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(StartClient.class);
    public static void main(ProtocolConfig protocolConfig) {
        if (protocolConfig == null) {
            logger.info("invalid protocol config: null");
            return;
        }
        if (AppConstant.appNameTimeClient.equals(protocolConfig.getName())) {
            TimeClient.main(protocolConfig);
        } else if (AppConstant.appNameClient.equals(protocolConfig.getName())) {
            SingleThreadedCapitalizationClient.main(protocolConfig);
        } else {
            logger.info("invalid protocol config: "+ protocolConfig.toString());
        }
    }
}
