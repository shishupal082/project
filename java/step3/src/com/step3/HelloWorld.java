package com.step3;

import com.step2.DateLibrary;
import com.step3.service.MessageService;
import cucumber.examples.java.calculator.DateCalculator;

import java.util.Date;

/**
 * Created by shishupalkumar on 10/01/17.
 */

public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello World");
        System.out.println(MessageService.getMessage());

        MessageService messageService = new MessageService();
        System.out.println(messageService.getStrMessage());

        DateLibrary dateLibrary = new DateLibrary();
        System.out.println(dateLibrary.getDateStringNow());

        DateCalculator dateCalculator = new DateCalculator(new Date());
        System.out.println(dateCalculator.isDateInThePast(new Date()));
    }
}
