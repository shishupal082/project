package com.project.communication.service;

import com.project.communication.capitalization.CapitalizationClient;
import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppConstant;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.serviceV3.ActualClient;
import com.project.communication.serviceV3.FileClient;
import com.project.communication.tcp.TcpClient;
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
//            SingleThreadedCapitalizationClient.main(protocolConfig);
            CapitalizationClient.main(protocolConfig);
        } else if (AppConstant.appNameTcpClient.equals(protocolConfig.getName())) {
            TcpClient.main(protocolConfig);
        } else if (AppConstant.appNameFileClient.equals(protocolConfig.getName())) {
            FileClient.main(protocolConfig);
        } else if (AppConstant.appNameActualClient.equals(protocolConfig.getName())) {
            ActualClient.main(protocolConfig);
        } else {
            logger.info("invalid protocol config: "+ protocolConfig.toString());
        }
    }
}
