package com.project.communication.service;

import com.project.communication.capitalization.CapitalizationServer;
import com.project.communication.capitalization.MultiThreadedCapitalizationServer;
import com.project.communication.capitalization.SingleThreadedCapitalizationServer;
import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.config.AppConstant;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.time.TimeServer;

public class StartServer {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(StartServer.class);
    public static void main(ProtocolConfig protocolConfig) {
        if (protocolConfig == null) {
            logger.info("invalid protocol config: null");
            return;
        }
        if (AppConstant.appNameTimeServer.equals(protocolConfig.getName())) {
            TimeServer.main(protocolConfig);
        } else if (AppConstant.appNameServerSingleThread.equals(protocolConfig.getName())) {
            SingleThreadedCapitalizationServer.main(protocolConfig);
        } else if (AppConstant.appNameServer.equals(protocolConfig.getName())) {
            MultiThreadedCapitalizationServer.main(protocolConfig);
//            CapitalizationServer.main(protocolConfig);
        }
    }
}
