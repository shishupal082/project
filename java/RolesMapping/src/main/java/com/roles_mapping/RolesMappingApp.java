package com.roles_mapping;

import com.roles_mapping.config.Db;
import com.roles_mapping.service.BridgeStaticService;
import com.roles_mapping.service.RoleService;
import com.roles_mapping.service.SortingService;

import java.util.ArrayList;
import java.util.HashMap;

public class RolesMappingApp {
    private final RoleService roleService;
    private final SortingService sortingService;
    public RolesMappingApp() {
        this.roleService = new RoleService(new Db());
        this.sortingService = new SortingService();
    }
    public boolean updateRoleConfig(final String roleConfigDir, final ArrayList<String> roleConfigPath) {
        ArrayList<String> rolesConfigPath = this.roleService.getRolesConfigPath(roleConfigDir, roleConfigPath);
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

    public Boolean isValidCondition(String cellData, ArrayList<String> range, ArrayList<String> notInRange,
                                    Boolean isEmpty, String regex) {
        return BridgeStaticService.isValidCondition(cellData,range,notInRange,isEmpty,regex);
    }
    public boolean isPatternMatching(String str, String pattern, boolean exactMatch) {
        return BridgeStaticService.isPatternMatching(str,pattern,exactMatch);
    }
    public ArrayList<ArrayList<String>> sortExcelData(ArrayList<ArrayList<String>> excelData, Integer index,
                                                      String order, String dataType, String defaultData) {
        return this.sortingService.sortExcelData(excelData, index, order, dataType, defaultData);
    }
    public static void main(String[] args) {
        System.out.println("Roles mapping app.");
    }
}
