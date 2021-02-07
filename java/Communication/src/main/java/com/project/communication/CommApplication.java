package com.project.communication;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.common.SysUtils;
import com.project.communication.config.AppConfig;
import com.project.communication.config.EnvConfig;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.parser.YamlFileParser;
import com.project.communication.service.StartProgram;

import java.util.Arrays;
import java.util.HashMap;

public class CommApplication {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(CommApplication.class);
    private final static SysUtils sysUtils = new SysUtils();
    public static AppConfig appConfig = null;
    public static void main(String[] args) throws Exception  {
        String envConfigPath = sysUtils.getProjectWorkingDir()+"/meta-data/env_config.yml";
        String programName = "server";
        if (args.length >= 1) {
            programName = args[0];
        }
        if (args.length >= 2) {
            envConfigPath = args[1];
        }
        EnvConfig envConfig = YamlFileParser.getEnvConfig(envConfigPath);
        appConfig = new AppConfig(envConfig);
        SysUtils sysUtils = new SysUtils();
        LoggerV2.setUuid(sysUtils.createUUIDNumber());
//        logger.info(envConfig.toString());
        logger.info("program arg: "+Arrays.toString(args));
        HashMap<String, ProtocolConfig> programConfig = envConfig.getProgramConfig();
        if (programConfig == null) {
            logger.info("Invalid program config.");
            return;
        }
        ProtocolConfig protocolConfig = programConfig.get(programName);
        if (protocolConfig == null) {
            logger.info("Invalid program name: " + programName);
            return;
        }
        StartProgram startProgram = new StartProgram(protocolConfig);
        startProgram.start();
    }
}
