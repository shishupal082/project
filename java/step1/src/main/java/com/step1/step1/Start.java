package com.step1.step1;

import com.step1.step1.service.MessageService;
import com.step2.DateLibrary;
import cucumber.examples.java.calculator.DateCalculator;

import java.util.Date;

/**
 * Created by shishupalkumar on 10/01/17.
 */
public class Start {
    public static void main(String[] args) {
        System.out.println("Step1 Start");
        System.out.println(MessageService.getMessage());
        DateLibrary dateLibrary = new DateLibrary();
        System.out.println(dateLibrary.getDateStringNow());

        DateCalculator dateCalculator = new DateCalculator(new Date());
        System.out.println(dateCalculator.isDateInThePast(new Date()));
    }
}
