package com.project.communication.obj;

import com.project.communication.service.ReadInput;

import java.util.TimerTask;

public interface ReadInterface {
    void endReadChar(TimerTask timerTask);
    void printData(ReadInput readInput);
}
