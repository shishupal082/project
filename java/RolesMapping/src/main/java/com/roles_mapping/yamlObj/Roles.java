package com.roles_mapping.yamlObj;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;
import java.util.HashMap;

@JsonIgnoreProperties(ignoreUnknown = true)

public class Roles {
    private HashMap<String, ArrayList<String>> roleAccess;
    private HashMap<String, String> roleAccessMapping;
    private HashMap<String, ArrayList<String>> relatedUsers;
    private ArrayList<String> coRelatedUsers;
    private HashMap<String, ArrayList<String>> groupRelatedUsers;
    private HashMap<String, ArrayList<String>> userRolesMapping;
    public Roles() {}
    public Roles(boolean isInit) {
        if (isInit) {
            roleAccess = new HashMap<>();
            roleAccessMapping = new HashMap<>();
            relatedUsers = new HashMap<>();
            coRelatedUsers = new ArrayList<>();
            groupRelatedUsers = new HashMap<>();
            userRolesMapping = new HashMap<>();
        }
    }
    public HashMap<String, ArrayList<String>> getRoleAccess() {
        return roleAccess;
    }

    public void setRoleAccess(HashMap<String, ArrayList<String>> roleAccess) {
        this.roleAccess = roleAccess;
    }

    public HashMap<String, String> getRoleAccessMapping() {
        return roleAccessMapping;
    }

    public void setRoleAccessMapping(HashMap<String, String> roleAccessMapping) {
        this.roleAccessMapping = roleAccessMapping;
    }

    public HashMap<String, ArrayList<String>> getRelatedUsers() {
        return relatedUsers;
    }

    public void setRelatedUsers(HashMap<String, ArrayList<String>> relatedUsers) {
        this.relatedUsers = relatedUsers;
    }

    public ArrayList<String> getCoRelatedUsers() {
        return coRelatedUsers;
    }

    public void setCoRelatedUsers(ArrayList<String> coRelatedUsers) {
        this.coRelatedUsers = coRelatedUsers;
    }

    public HashMap<String, ArrayList<String>> getGroupRelatedUsers() {
        return groupRelatedUsers;
    }

    public void setGroupRelatedUsers(HashMap<String, ArrayList<String>> groupRelatedUsers) {
        this.groupRelatedUsers = groupRelatedUsers;
    }

    public HashMap<String, ArrayList<String>> getUserRolesMapping() {
        return userRolesMapping;
    }

    public void setUserRolesMapping(HashMap<String, ArrayList<String>> userRolesMapping) {
        this.userRolesMapping = userRolesMapping;
    }

    @Override
    public String toString() {
        return "Roles{" +
                "roleAccess=" + roleAccess +
                ", roleAccessMapping=" + roleAccessMapping +
                ", relatedUsers=" + relatedUsers +
                ", coRelatedUsers=" + coRelatedUsers +
                ", groupRelatedUsers=" + groupRelatedUsers +
                ", userRolesMapping=" + userRolesMapping +
                '}';
    }
}
