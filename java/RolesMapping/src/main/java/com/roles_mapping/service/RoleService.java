package com.roles_mapping.service;

import com.roles_mapping.config.BridgeConstant;
import com.roles_mapping.config.Db;
import com.roles_mapping.yamlObj.Roles;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class RoleService {
    private final static Logger logger = LoggerFactory.getLogger(RoleService.class);
    private final Db db;
    public RoleService(final Db db) {
        this.db = db;
    }
    public Roles getRolesConfig() {
        if (db != null) {
            return db.getRoles();
        }
        return null;
    }
    public ArrayList<String> getActiveRoleIdByUserName(String username) {
        if (BridgeStaticService.isInValidString(username)) {
            logger.info("Invalid username:{}", username);
            return null;
        }
        HashMap<String, ArrayList<String>> userRolesMapping = this.getUserRolesMapping();
        if (userRolesMapping != null) {
            return userRolesMapping.get(username);
        }
        return null;
    }
    public HashMap<String, ArrayList<String>> getAllRelatedUsers() {
        // It may not contains all user
        Roles roles = this.getRolesConfig();
        if (roles == null) {
            return null;
        }
        return roles.getRelatedUsers();
    }
    private void addRoleNameInUser(HashMap<String, ArrayList<String>> userRolesMapping,
                                   String username, String roleName) {
        if (userRolesMapping == null) {
            return;
        }
        userRolesMapping.computeIfAbsent(username, k -> new ArrayList<>());
        if (!userRolesMapping.get(username).contains(roleName)) {
            userRolesMapping.get(username).add(roleName);
        }
    }
    public void updateUserRolesMapping(){
        Roles roles = this.getRolesConfig();
        if (roles == null) {
            return;
        }
        HashMap<String, ArrayList<String>> userRolesMapping = new HashMap<>();
        HashMap<String, String> roleAccessMapping = roles.getRoleAccessMapping();
        ArrayList<String> allUsername = this.getAllUsersName();
        if (roleAccessMapping != null && allUsername != null) {
            for(String tempUsername: allUsername) {
                for (Map.Entry<String, String> el1: roleAccessMapping.entrySet()) {
                    boolean result = this.apiRolesIncludeUser(el1.getValue(), tempUsername);
                    if (result) {
                        this.addRoleNameInUser(userRolesMapping, tempUsername, el1.getKey());
                    }
                }
            }
        }
        roles.setUserRolesMapping(userRolesMapping);
//        logger.info("userRolesMapping updated: {}", userRolesMapping);
    }
    public ArrayList<String> getRolesConfigPath(String roleConfigDir, ArrayList<String> roleConfigPath) {
        if (roleConfigDir == null) {
            return roleConfigPath;
        }
        ArrayList<String> rolesConfigPath = new ArrayList<>();
        if (roleConfigPath != null) {
            if (!roleConfigPath.isEmpty()) {
                for (String filename: roleConfigPath) {
                    if (filename == null || filename.isEmpty()) {
                        continue;
                    }
                    rolesConfigPath.add(roleConfigDir+filename);
                }
            }
        }
        return rolesConfigPath;
    }
    public boolean updateRoles(ArrayList<String> rolesConfigPath) {
        Roles roles = this.getRolesConfigByConfigPath(rolesConfigPath);
        if (roles != null) {
            this.db.setRoles(roles);
            this.updateUserRolesMapping();
            logger.info("Roles update success");
            return true;
        }
        logger.info("Error in updating roles");
        return false;
    }
    public ArrayList<String> getRelatedUsers(String username) {
        if (username == null) {
            return null;
        }
        Roles roles = this.getRolesConfig();
        if (roles == null) {
            return null;
        }
        HashMap<String, ArrayList<String>> relatedUsers = roles.getRelatedUsers();
        if (relatedUsers == null) {
            return null;
        }
        return relatedUsers.get(username);
    }
    public HashMap<String, ArrayList<String>> getRolesAccess() {
        Roles roles = this.getRolesConfig();
        if (roles != null) {
            return roles.getRoleAccess();
        }
        return null;
    }
    public ArrayList<String> getRolesAccessByRoleId(String roleId) {
        if (BridgeStaticService.isInValidString(roleId)) {
            logger.info("Invalid roleId:{}", roleId);
            return null;
        }
        HashMap<String, ArrayList<String>> rolesAccess = this.getRolesAccess();
        ArrayList<String> roleAccess;
        if (rolesAccess != null && rolesAccess.get(roleId) != null) {
            roleAccess = rolesAccess.get(roleId);
            if (roleAccess != null) {
                return roleAccess;
            }
            logger.info("Invalid rolesAccess:{}, for roleId:{}", null, roleId);
        }
        logger.info("roleId not found: {}", roleId);
        return null;
    }
    private String getBooleanEquivalentToRole(String role, String userName) {
        if (BridgeStaticService.isInValidString(role)) {
            logger.info("Invalid role:{}", role);
            return null;
        }
        if (BridgeConstant.TRUE.equals(role)) {
            return BridgeConstant.TRUE;
        }
        if (BridgeStaticService.isInValidString(userName)) {
            logger.info("Invalid userName:{}", userName);
            return null;
        }
        ArrayList<String> roleAccessUsers = this.getRolesAccessByRoleId(role);
        if (roleAccessUsers == null) {
            logger.info("roleAccessUsers is null");
            return null;
        }
        if (roleAccessUsers.contains(userName)) {
            return BridgeConstant.TRUE;
        }
        return BridgeConstant.FALSE;
    }
    public boolean apiRolesIncludeUser(String roleAccessMappingId, String userName) {
        if (BridgeStaticService.isInValidString(roleAccessMappingId)) {
            logger.info("Invalid apiRoles: {}", roleAccessMappingId);
            return false;
        }
        ExpressionEvaluator evaluator = new ExpressionEvaluator();
        ArrayList<String> tokens = evaluator.tokenizeBinary(roleAccessMappingId);
        ArrayList<String> parameters = new ArrayList<>();
        parameters.add(BridgeConstant.OPEN);
        parameters.add(BridgeConstant.CLOSE);
        parameters.add(BridgeConstant.NOT);
        parameters.add(BridgeConstant.AND);
        parameters.add(BridgeConstant.OR);
        String token;
        for (int i=0; i<tokens.size(); i++) {
            token = tokens.get(i);
            if (token == null || parameters.contains(token)) {
                continue;
            }
            token = token.trim();
            tokens.set(i, this.getBooleanEquivalentToRole(token, userName));
        }
        Boolean finalResult = evaluator.evaluateBinaryExpression(String.join("", tokens));
        if (finalResult == null) {
            logger.info("Invalid finalResult: null");
            return false;
        }
        return finalResult;
    }
    public ArrayList<String> getAllUsersName() {
        Roles roles = this.getRolesConfig();
        if (roles == null) {
            return null;
        }
        HashMap<String, ArrayList<String>> relatedUsers = roles.getRelatedUsers();
        HashMap<String, ArrayList<String>> roleAccess = roles.getRoleAccess();
        ArrayList<String> userNames;
        ArrayList<String> allUsername = new ArrayList<>();
        if (relatedUsers != null) {
            for (Map.Entry<String, ArrayList<String>> el: relatedUsers.entrySet()) {
                userNames = el.getValue();
                if (userNames == null) {
                    continue;
                }
                for(String userName: userNames) {
                    if (userName != null && !allUsername.contains(userName)) {
                        allUsername.add(userName);
                    }
                }
            }
        }
        if (roleAccess != null) {
            for (Map.Entry<String, ArrayList<String>> el: roleAccess.entrySet()) {
                userNames = el.getValue();
                if (userNames == null) {
                    continue;
                }
                for(String userName: userNames) {
                    if (userName != null && !allUsername.contains(userName)) {
                        allUsername.add(userName);
                    }
                }
            }
        }
        return allUsername;
    }
    private ArrayList<String> removeDuplicate(ArrayList<String> entry) {
        ArrayList<String> result = new ArrayList<>();
        if (entry == null) {
            return result;
        }
        for (String str: entry) {
            if (result.contains(str)) {
                continue;
            }
            result.add(str);
        }
        result.sort(Collections.reverseOrder());
        return result;
    }
    private void addGroupEntry(Map<String, ArrayList<String>> coRelatedUsers,
                               ArrayList<String> users1, ArrayList<String> users2) {
        if (coRelatedUsers == null || users1 == null || users2 == null) {
            return;
        }
        ArrayList<String> temp;
        for (String username: users1) {
            temp = coRelatedUsers.get(username);
            if (temp == null) {
                coRelatedUsers.put(username, users2);
                continue;
            }
            temp = new ArrayList<>(temp);
            for (String username2: users2) {
                if (temp.contains(username2)) {
                    continue;
                }
                temp.add(username2);
            }
            coRelatedUsers.put(username, temp);
        }
    }
    private void addEntry(Map<String, ArrayList<String>> coRelatedUsers, String user1, String user2) {
        if (coRelatedUsers == null || user1 == null || user2 == null) {
            return;
        }
        ArrayList<String> user1Group = coRelatedUsers.get(user1);
        ArrayList<String> user2Group = coRelatedUsers.get(user2);
        ArrayList<String> combineUserGroup = new ArrayList<>();
        combineUserGroup.add(user1);
        if (!combineUserGroup.contains(user2)) {
            combineUserGroup.add(user2);
        }
        if (user1Group == null) {
            user1Group = new ArrayList<>();
        }
        if (user2Group == null) {
            user2Group = new ArrayList<>();
        }
        for(String str: user1Group) {
            if (!combineUserGroup.contains(str)) {
                combineUserGroup.add(str);
            }
        }
        for(String str: user2Group) {
            if (!combineUserGroup.contains(str)) {
                combineUserGroup.add(str);
            }
        }
        for(String str: combineUserGroup) {
            coRelatedUsers.put(str, combineUserGroup);
        }
        coRelatedUsers.put(user1, combineUserGroup);
        coRelatedUsers.put(user2, combineUserGroup);
    }
    public Roles getRolesConfigByConfigPath(ArrayList<String> rolesConfigPath) {
        RolesFileParser rolesFileParser = new RolesFileParser();
        Roles roles = rolesFileParser.getAllRolesFileData(rolesConfigPath);
        HashMap<String, ArrayList<String>> relatedUsers = null;
        HashMap<String, ArrayList<String>> groupRelatedUsers = null;
        HashMap<String, ArrayList<String>> rolesAccess = null;
        ArrayList<String> coRelatedUsers = null;
        if (roles == null) {
            return null;
        }
        rolesAccess = roles.getRoleAccess();
        relatedUsers = roles.getRelatedUsers();
        coRelatedUsers = roles.getCoRelatedUsers();
        groupRelatedUsers = roles.getGroupRelatedUsers();
        String username;
        ArrayList<String> usernames;
        /*Mixing co-related user properly */
        HashMap<String, ArrayList<String>> tempCoRelatedUsers = new HashMap<>();
        if (coRelatedUsers != null && rolesAccess != null) {
            ArrayList<String> groupUsers;
            for (String userGroupName: coRelatedUsers) {
                groupUsers = rolesAccess.get(userGroupName);
                if (groupUsers != null) {
                    for(String str: groupUsers) {
                        for(String str1: groupUsers) {
                            this.addEntry(tempCoRelatedUsers, str, str1);
                        }
                    }
                }
            }
        }
//        logger.info("tempCoRelatedUsers: {}", tempCoRelatedUsers);
        /*Mixing co-related user properly end */
        /*Mixing co-related user and group related users properly */
        String groupName1;
        ArrayList<String> relatedGroups, userByGroupName1, userByGroupName2;
        if (groupRelatedUsers != null && rolesAccess != null) {
            for (Map.Entry<String, ArrayList<String>> el: groupRelatedUsers.entrySet()) {
                groupName1 = el.getKey();
                relatedGroups = el.getValue();
                if (groupName1 == null || relatedGroups == null) {
                    continue;
                }
                userByGroupName1 = rolesAccess.get(groupName1);
                if (userByGroupName1 != null) {
                    for (String ignored : userByGroupName1) {
                        for (String groupName2: relatedGroups) {
                            userByGroupName2 = rolesAccess.get(groupName2);
                            this.addGroupEntry(tempCoRelatedUsers, userByGroupName1, userByGroupName2);
                        }
                    }
                }
            }
        }
//        logger.info("tempCoRelatedUsers after group user merging: {}", tempCoRelatedUsers);
        /*Mixing co-related user and group related users end */
        if (relatedUsers == null) {
            relatedUsers = new HashMap<>();
        }
        /* Combining relatedUsers and coRelatedUsers */
        ArrayList<String> relatedUsersGroupNames;
        HashMap<String, ArrayList<String>> tempRelatedUsers = new HashMap<>();
        ArrayList<String> usernamesV2;
        if (rolesAccess != null) {
            for (Map.Entry<String, ArrayList<String>> el: relatedUsers.entrySet()) {
                usernamesV2 = new ArrayList<>();
                username = el.getKey();
                relatedUsersGroupNames = el.getValue();
                if (relatedUsersGroupNames != null) {
                    for (String groupName: relatedUsersGroupNames) {
                        usernames = rolesAccess.get(groupName);
                        if (usernames != null) {
                            usernamesV2.addAll(usernames);
                            usernamesV2.add(username);
                        }
                    }
                }
                if (!usernamesV2.isEmpty()) {
                    tempRelatedUsers.put(username, usernamesV2);
                }
            }
        }
//        logger.info("tempRelatedUsers: {}", tempRelatedUsers);
        /* Combining tempRelatedUsers and tempCoRelatedUsers */
        for (Map.Entry<String, ArrayList<String>> el: tempRelatedUsers.entrySet()) {
            username = el.getKey();
            if (username == null) {
                continue;
            }
            usernames = el.getValue();
            if (usernames == null) {
                usernames = new ArrayList<>();
            }
            usernamesV2 = tempCoRelatedUsers.get(username);
            if (usernamesV2 == null) {
                usernamesV2 = new ArrayList<>();
            }
            for (String str: usernamesV2) {
                if (usernames.contains(str)) {
                    continue;
                }
                usernames.add(str);
            }
        }
        for (Map.Entry<String, ArrayList<String>> el: tempCoRelatedUsers.entrySet()) {
            username = el.getKey();
            if (username == null) {
                continue;
            }
            usernames = el.getValue();
            if (usernames == null || usernames.isEmpty()) {
                continue;
            }
            usernamesV2 = tempRelatedUsers.get(username);
            if (usernamesV2 == null) {
                usernamesV2 = new ArrayList<>();
            }
            for (String str: usernames) {
                if (usernamesV2.contains(str)) {
                    continue;
                }
                usernamesV2.add(str);
            }
            tempRelatedUsers.put(username, usernamesV2);
        }
//        logger.info("relatedUsers after merging: {}", tempRelatedUsers);
        HashMap<String, ArrayList<String>> finalRelatedUsers = new HashMap<>();
        String username1;
        ArrayList<String> usernameList;
        for (Map.Entry<String, ArrayList<String>> el: tempRelatedUsers.entrySet()) {
            username1 = el.getKey();
            usernameList = el.getValue();
            usernameList.add(username1);
            finalRelatedUsers.put(username1, this.removeDuplicate(usernameList));
        }
        roles.setRelatedUsers(finalRelatedUsers);
//        logger.info("finalRelatedUsers after duplicate removal: {}", finalRelatedUsers);
//        logger.info("roles config data: {}", roles);
        return roles;
    }
    public HashMap<String, ArrayList<String>> getUserRolesMapping() {
        Roles roles = this.getRolesConfig();
        if (roles != null) {
            return roles.getUserRolesMapping();
        }
        return null;
    }
    public boolean isRoleAuthorised(String roleName, String userName) {
        if (BridgeStaticService.isInValidString(roleName)) {
            logger.info("isRoleAuthorised check request: {}, {}, invalid roleName: {}", roleName, userName, roleName);
            return false;
        }
        if (BridgeStaticService.isInValidString(userName)) {
            logger.info("isRoleAuthorised check request: {}, {}, invalid userName: {}", roleName, userName, userName);
            return false;
        }
        boolean result = false;
        HashMap<String, ArrayList<String>> userRolesMapping = this.getUserRolesMapping();
        if (userRolesMapping != null) {
            if (userRolesMapping.get(userName) != null) {
                result = userRolesMapping.get(userName).contains(roleName);
            } else {
                logger.info("isRoleAuthorised check userRolesMapping not found for request: {},{}", roleName, userName);
            }
        } else {
            logger.info("isRoleAuthorised check userRolesMapping is null, for request: {},{}", roleName, userName);
        }
        logger.info("isRoleAuthorised check status:{},{},{}", roleName, userName, result);
        return result;
    }
}
