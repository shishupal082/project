package com.roles_mapping;

import com.roles_mapping.config.Db;
import com.roles_mapping.service.RoleService;

import java.util.ArrayList;
import java.util.HashMap;

public class RolesMappingApp {
    private final String roleConfigDir;
    private final RoleService roleService;
    public RolesMappingApp(final String roleConfigDir) {
        this.roleConfigDir = roleConfigDir;
        this.roleService = new RoleService(new Db());
    }
    public boolean updateRoleConfig(final ArrayList<String> roleConfigPath) {
        ArrayList<String> rolesConfigPath = this.roleService.getRolesConfigPath(this.roleConfigDir, roleConfigPath);
        return this.roleService.updateRoles(rolesConfigPath);
    }
    public boolean isRoleAuthorised(String apiName, String userName) {
        return this.roleService.isRoleAuthorised(apiName, userName);
    }
    public ArrayList<String> getActiveRoleIdByUserName(String username) {
        return this.roleService.getActiveRoleIdByUserName(username);
    }
    public ArrayList<String> getRelatedUsers(String username) {
        return this.roleService.getRelatedUsers(username);
    }
    public HashMap<String, ArrayList<String>> getAllRelatedUsers() {
        return this.roleService.getAllRelatedUsers();
    }
    public ArrayList<String> getAllUsersName() {
        return this.roleService.getAllUsersName();
    }
    public Object getRolesConfig() {
        return this.roleService.getRolesConfig();
    }
    public static void main(String[] args) {
        System.out.println("Roles mapping app.");
    }
}
