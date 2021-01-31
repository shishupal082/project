package com.project.communication.obj;

import com.project.communication.common.LoggerFactoryV2;
import com.project.communication.common.LoggerV2;
import com.project.communication.service.ReadInput;

import java.util.TimerTask;

public class ReadData implements ReadInterface {
    private final static LoggerV2 logger = LoggerFactoryV2.getLogger(ReadData.class);
    public ReadData() {}
    @Override
    public void endReadChar(TimerTask readCharDataTimer) {
        readCharDataTimer.cancel();
    }
    @Override
    public void printData(ReadInput readInput) {
        logger.info("PrintData: "+ readInput.getByteData());
    }
}
