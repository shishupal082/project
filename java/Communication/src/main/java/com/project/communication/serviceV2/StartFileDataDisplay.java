package com.project.communication.serviceV2;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.obj.ProtocolConfig;
import com.project.communication.parser.TextFileParser;

import java.util.ArrayList;
import java.util.Timer;
import java.util.TimerTask;

public class StartFileDataDisplay extends TimerTask {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(StartFileDataDisplay.class);
    private final ProtocolConfig protocolConfig;
    private final FileService fileService = new FileService();
    private final ArrayList<String> oldFileNames = new ArrayList<>();
    private ArrayList<String> newFileNames;
    private int count = 0;
    public StartFileDataDisplay(ProtocolConfig protocolConfig) {
        this.protocolConfig = protocolConfig;
        this.scanResult();
    }
    private void scanResult() {
        newFileNames = new ArrayList<>();
        ScanResult scanResult = fileService.scanDirectory(protocolConfig.getServerIp(),
                protocolConfig.getServerIp(), false);
        if (scanResult != null) {
            for (ScanResult scanResult1: scanResult.getScanResults()) {
                if (!oldFileNames.contains(scanResult1.getPathName())) {
                    newFileNames.add(scanResult1.getPathName());
                    oldFileNames.add(scanResult1.getPathName());
                }
            }
        }
        logger.info("New File Names Count: " + newFileNames.size() + ", " + newFileNames.toString());
    }
    private void displayFileData(String filepath) {
        TextFileParser textFileParser = new TextFileParser(filepath);
        ArrayList<String> fileData = textFileParser.getTextDataByLine();
        String result = "";
        if (fileData.size() > 0) {
            for (String str: fileData) {
                result = result.concat(str);
            }
            logger.info("File data: ", result);
        } else {
            logger.info("Invalid file data");
        }
    }
    private void displayNewFiles() {
        for (String filepath: newFileNames) {
            this.displayFileData(filepath);
        }
    }
    @Override
    public void run() {
        count++;
        logger.info("--------------------------------------------"+count);
        this.scanResult();
        this.displayNewFiles();
    }
    public static void main(ProtocolConfig protocolConfig) {
        StartFileDataDisplay startFileDataDisplay = new StartFileDataDisplay(protocolConfig);
        Timer timer = new Timer();
        timer.schedule(startFileDataDisplay, 0, 1000);
        logger.info("Application started");
    }
}
