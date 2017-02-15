package com.todo.model;

import java.util.ArrayList;
import java.util.Map;

/**
 * Created by shishupalkumar on 10/02/17.
 */
public class YamlObject {
    private String name;
    private int age;
    private Map<String, String> address;
    private String[] roles;
    private String[] mobile;
    private ArrayList<String> mobile1;
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public int getAge() {
        return age;
    }
    public void setAge(int age) {
        this.age = age;
    }
    public Map<String, String> getAddress() {
        return address;
    }
    public void setAddress(Map<String, String> address) {
        this.address = address;
    }
    public String[] getRoles() {
        return roles;
    }
    public void setRoles(String[] roles) {
        this.roles = roles;
    }

    public String[] getMobile() {
        return mobile;
    }

    public void setMobile(String[] mobile) {
        this.mobile = mobile;
    }

    public ArrayList<String> getMobile1() {
        return mobile1;
    }

    public void setMobile1(ArrayList<String> mobile1) {
        this.mobile1 = mobile1;
    }
}

