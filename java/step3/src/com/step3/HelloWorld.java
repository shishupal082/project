package com.step3;

import com.step2.DateLibrary;
import com.step2.service.S2MessageService;
import com.step3.service.S3MessageService;
import cucumber.examples.java.calculator.DateCalculator;

import java.util.Date;

/**
 * Created by shishupalkumar on 10/01/17.
 */

public class HelloWorld {
    public static void main(String[] args) {
        S2MessageService s2MessageService = new S2MessageService();
        System.out.println(s2MessageService.getMessage());
        System.out.println(S3MessageService.getMessage());

        S3MessageService s3MessageService = new S3MessageService();
        System.out.println(s3MessageService.getStrMessage());

        DateLibrary dateLibrary = new DateLibrary();
        System.out.println(dateLibrary.getDateStringNow());

        DateCalculator dateCalculator = new DateCalculator(new Date());
        System.out.println(dateCalculator.isDateInThePast(new Date()));
    }
}
