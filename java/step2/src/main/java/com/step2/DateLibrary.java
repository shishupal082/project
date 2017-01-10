package com.step2;

import java.util.Date;

/**
 * Created by shishupalkumar on 10/01/17.
 */

public class DateLibrary {
    private Date now;
    public DateLibrary() {
        this.now = new Date();
    }
    public String getDateStringNow() {
        return this.now.toString();
    }
}