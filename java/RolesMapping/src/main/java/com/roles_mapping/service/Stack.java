package com.roles_mapping.service;

import java.util.ArrayList;

public class Stack {
    private int top;
    private ArrayList<Object> strings;
    public Stack() {
        this.reset();
    }
    public void reset() {
        top = -1;
        strings = new ArrayList<>();
    }
    public boolean push(Object str) {
        if (str == null) {
            return false;
        }
        top++;
        if (top < strings.size() && top >= 0) {
            strings.set(top, str);
        } else {
            strings.add(str);
        }
        return true;
    }
    public Object pop() {
        if (top < 0) {
            return null;
        }
        Object result = strings.get(top);
        top--;
        return result;
    }
    public Object getTopElement() {
        if (top < 0) {
            return null;
        }
        return strings.get(top);
    }

    public int getTop() {
        return top;
    }
}
