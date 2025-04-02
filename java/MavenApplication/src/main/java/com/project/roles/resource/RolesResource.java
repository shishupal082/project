package com.project.roles.resource;

import com.project.roles.service.RolesService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;

public class RolesResource {
    private final static Logger logger = LoggerFactory.getLogger(RolesResource.class);
    private final RolesService rolesService;
    public RolesResource(RolesService rolesService) {
        this.rolesService = rolesService;
    }
    public boolean isRoleAuthorised(String apiName, String userName) {
        return rolesService.isRoleAuthorised(apiName, userName);
    }
    public ArrayList<String> getActiveRoleIdByUserName(String username) {
        return rolesService.getActiveRoleIdByUserName(username);
    }
/*
    public ArrayList<String> getRelatedUsers(String username) {
        return rolesService.getRelatedUsers(username);
    }
    public ArrayList<String> getAllUsersName() {
        return rolesService.getAllUsersName();
    }

    public void trackRelatedUser() {
        HashMap<String, ArrayList<String>> allRelatedUsers = rolesService.getAllRelatedUsers();
    }
    public Object getRolesConfig() {
        return rolesService.getRolesConfig();
    }
    public boolean updateRoles(ArrayList<String> rolesConfigPath) {
        boolean status = rolesService.updateRoles(rolesConfigPath);
        this.trackRelatedUser();
        return status;
    }
    // /api/get/roles/allByRid
    public Object getAllRolesByRolesId() {
        return null;
    }
    // /api/get/roles/u/{uid}
    public Object getAvailableRolesForUserId(String userId) {
        return null;
    }
    // /api/get/roles/r/{roleId}
    public Object getAvailableUsersForRoleId(String rId) {
        return null;
    }
 */
}
