package com.todo.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.Map;

/**
 * Created by shishupalkumar on 10/02/17.
 */
public class YamlObject {
    private String name;
    private int age;
    private Map<String, String> address;
    private String[] roles1;
    private String[] roles2;
    private ArrayList<String> roles3;
    private ArrayList<String> roles4;
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
    public String[] getRoles1() {
        return roles1;
    }
    public void setRoles1(String[] roles1) {
        this.roles1 = roles1;
    }

    public String[] getRoles2() {
        return roles2;
    }

    public void setRoles2(String[] roles2) {
        this.roles2 = roles2;
    }

    public ArrayList<String> getRoles3() {
        return roles3;
    }

    public void setRoles3(ArrayList<String> roles3) {
        this.roles3 = roles3;
    }

    public ArrayList<String> getRoles4() {
        return roles4;
    }

    public void setRoles4(ArrayList<String> roles4) {
        this.roles4 = roles4;
    }
}

