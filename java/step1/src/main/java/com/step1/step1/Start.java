package com.step1.step1;

import com.step1.step1.service.S1MessageService;
import com.step2.service.S2MessageService;
import com.step2.DateLibrary;
import cucumber.examples.java.calculator.DateCalculator;

import java.util.Date;

/**
 * Created by shishupalkumar on 10/01/17.
 */
public class Start {
    public static void main(String[] args) {
        S2MessageService s2MessageService = new S2MessageService();
        System.out.println(s2MessageService.getMessage());
        System.out.println(S1MessageService.getMessage());
        DateLibrary dateLibrary = new DateLibrary();
        System.out.println(dateLibrary.getDateStringNow());

        DateCalculator dateCalculator = new DateCalculator(new Date());
        System.out.println(dateCalculator.isDateInThePast(new Date()));
    }
}
