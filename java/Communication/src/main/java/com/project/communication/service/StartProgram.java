package com.project.communication.service;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.common.StaticService;
import com.project.communication.config.ApplicationName;
import com.project.communication.interceptorTcp.TransferRequest;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.serviceV2.StartFileDataDisplay;

public class StartProgram {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(StartProgram.class);
    private final ProtocolConfig protocolConfig;
    public StartProgram(ProtocolConfig protocolConfig) {
        this.protocolConfig = protocolConfig;
    }
    public void start() {
        if (protocolConfig == null) {
            logger.info("invalid protocolConfig: null");
            return;
        }
        logger.info(protocolConfig.toString());
        String applicationNameStr = protocolConfig.getApplication();
        ApplicationName applicationName = StaticService.getApplicationName(applicationNameStr);
        if (applicationName == null) {
            logger.info("invalid applicationName: " + applicationNameStr);
            return;
        }
        if (applicationName == ApplicationName.SERVER) {
            StartServer.main(protocolConfig);
        } else if (applicationName == ApplicationName.CLIENT) {
            StartClient.main(protocolConfig);
        } else if (applicationName == ApplicationName.INTERCEPTOR) {
            TransferRequest.main(protocolConfig);
        } else if(applicationName == ApplicationName.FileDataDisplay) {
            StartFileDataDisplay.main(protocolConfig);
        } else {
            logger.info("invalid application name: "+ applicationNameStr);
        }
    }
}
