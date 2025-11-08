package com.roles_mapping;

import com.roles_mapping.config.Db;
import com.roles_mapping.service.BridgeStaticService;
import com.roles_mapping.service.ExpressionEvaluator;
import com.roles_mapping.service.RoleService;
import com.roles_mapping.service.RolesFileParser;
import com.roles_mapping.yamlObj.Roles;
import org.junit.Assert;
import org.junit.Test;

import java.util.ArrayList;

public class TestRoles {
    private final ExpressionEvaluator testRoles = new ExpressionEvaluator();
    @Test
    public void testRelatedUsers() {
        ArrayList<String> rolesFilePath = new ArrayList<>();
        rolesFilePath.add(BridgeStaticService.getProjectWorkingDir()+"/meta-data/config-files/roles/roles.yml");
        rolesFilePath.add(BridgeStaticService.getProjectWorkingDir()+"/meta-data/config-files/roles/roles_2.yml");
        RoleService rolesService = new RoleService(null);
        Assert.assertNull(rolesService.getRelatedUsers(null));
        Assert.assertNull(rolesService.getAllUsersName());
        rolesService = new RoleService(new Db());
        rolesService.updateRoles(rolesFilePath);
        Assert.assertEquals(22, rolesService.getAllUsersName().size());
        Assert.assertEquals("U5,U4,U3,U2,U1,U6,U9,Group1Login,U_without_role_access," +
                        "U11,U13,U12,U18,U17,U15,U14,U16,U7,admin,Admin,adminAndDev,UX",
                String.join(",", rolesService.getAllUsersName()));
        Assert.assertEquals(17, rolesService.getAllRelatedUsers().size());
        Assert.assertEquals("U5,U6,U9,Group1Login,U_without_role_access,U11,U13,U12,U15,U14,U17,U16,U1,U2,U18,U3,U4",
                String.join(",",rolesService.getAllRelatedUsers().keySet()));
        Assert.assertEquals("U5,U4,U3,U2,U1", String.join(",", rolesService.getRelatedUsers("U1")));
        Assert.assertEquals("U5,U4,U3,U2,U1", String.join(",", rolesService.getRelatedUsers("U2")));
        Assert.assertEquals("U5,U4,U3,U2,U1", String.join(",", rolesService.getRelatedUsers("U3")));
        Assert.assertEquals("U5,U4,U3,U2,U1", String.join(",", rolesService.getRelatedUsers("U4")));
        Assert.assertEquals("U5,U4,U3,U2,U1", String.join(",", rolesService.getRelatedUsers("U5")));
        Assert.assertEquals("U6,U3", String.join(",", rolesService.getRelatedUsers("U6")));
        Assert.assertNull(rolesService.getRelatedUsers("U7"));
        Assert.assertNull(rolesService.getRelatedUsers("U8"));
        Assert.assertEquals("U9", String.join(",", rolesService.getRelatedUsers("U9")));
        Assert.assertNull(rolesService.getRelatedUsers("U10"));
        Assert.assertEquals("U3,U11", String.join(",", rolesService.getRelatedUsers("U11")));
        Assert.assertEquals("U18,U17,U15", String.join(",", rolesService.getRelatedUsers("U15")));
        Assert.assertEquals("U18,U17,U16", String.join(",", rolesService.getRelatedUsers("U16")));
        Assert.assertEquals("U3,U2,U17,U16,U15,U1", String.join(",", rolesService.getRelatedUsers("U17")));
        Assert.assertEquals("U3,U2,U18,U16,U15,U1", String.join(",", rolesService.getRelatedUsers("U18")));
    }

    @Test
    public void testRoleFileEntry() {
        RolesFileParser rolesFileParser = new RolesFileParser();
        Assert.assertNull(rolesFileParser.getAllRolesFileData(null));
        ArrayList<String> invalidRolesFilePath = new ArrayList<>();
        invalidRolesFilePath.add("invalid-file-name");
        Assert.assertNull(rolesFileParser.getAllRolesFileData(invalidRolesFilePath));
        ArrayList<String> rolesFilePath = new ArrayList<>();
        rolesFilePath.add(BridgeStaticService.getProjectWorkingDir()+"/meta-data/config-files/roles/roles.yml");
        rolesFilePath.add(BridgeStaticService.getProjectWorkingDir()+"/meta-data/config-files/roles/roles_2.yml");
        Roles roles = rolesFileParser.getAllRolesFileData(rolesFilePath);
        Assert.assertNotNull(roles);
        Assert.assertNotNull(roles.getRoleAccess());
        Assert.assertNotNull(roles.getRoleAccessMapping());
    }
    @Test
    public void testRoleService() {
        RoleService rolesService;
        ArrayList<String> invalidRolesFilePath = new ArrayList<>();
        invalidRolesFilePath.add("invalid-roles-file-path");
        rolesService = new RoleService(null);
        Assert.assertNull(rolesService.getRolesConfig());

        rolesService = new RoleService(new Db());
        Assert.assertNull(rolesService.getRolesConfig());
        Assert.assertNull(rolesService.getRolesAccess());
//        Assert.assertNull(rolesService.getApiRolesMapping());
//        Assert.assertEquals(0, rolesService.getAllRoles().size());
        Assert.assertNull(rolesService.getRolesAccessByRoleId(null));
        Assert.assertNull(rolesService.getRolesAccessByRoleId("admin"));
//        Assert.assertNull(rolesService.getRolesByApiName(null));
//        Assert.assertNull(rolesService.getRolesByApiName("getPublicFiles"));
        Assert.assertFalse(rolesService.isRoleAuthorised(null, null));
        Assert.assertFalse(rolesService.isRoleAuthorised(null, null));
        Assert.assertFalse(rolesService.isRoleAuthorised("apiName", null));
        Assert.assertFalse(rolesService.isRoleAuthorised("apiName", null));
        Assert.assertFalse(rolesService.isRoleAuthorised(null, "userName"));
        Assert.assertFalse(rolesService.isRoleAuthorised(null, "userName"));
        Assert.assertFalse(rolesService.isRoleAuthorised("isLogin", null));
        Assert.assertFalse(rolesService.isRoleAuthorised("isLogin", "username"));
        Assert.assertFalse(rolesService.isRoleAuthorised("isBooleanTrue", null));
        Assert.assertFalse(rolesService.isRoleAuthorised("isBooleanTrue", null));
        Assert.assertFalse(rolesService.isRoleAuthorised("isBooleanTrue", "username"));
        Assert.assertFalse(rolesService.isRoleAuthorised("isUploadFileEnable", "username"));
        Assert.assertFalse(rolesService.isRoleAuthorised("isUploadFileEnable", "username"));
        Assert.assertFalse(rolesService.isRoleAuthorised("isAddTextEnable", "username"));
        Assert.assertFalse(rolesService.isRoleAuthorised("isAddTextEnable", "username"));

        ArrayList<String> rolesFilePath = new ArrayList<>();
        rolesFilePath.add(BridgeStaticService.getProjectWorkingDir()+"/meta-data/config-files/roles/roles.yml");
        rolesFilePath.add(BridgeStaticService.getProjectWorkingDir()+"/meta-data/config-files/roles/roles_2.yml");
        rolesService.updateRoles(rolesFilePath);
        Assert.assertNotNull(rolesService.getRolesConfig());
        Assert.assertNotNull(rolesService.getRolesAccess());
//        Assert.assertNotNull(rolesService.getApiRolesMapping());
//        Assert.assertEquals(20, rolesService.getAllRoles().size());
        Assert.assertNotNull(rolesService.getRolesAccessByRoleId("admin"));
        Assert.assertNull(rolesService.getRolesAccessByRoleId("adminNotFound"));
//        Assert.assertNotNull(rolesService.getRolesByApiName("isAdminUser"));
        Assert.assertTrue(rolesService.isRoleAuthorised("isAdminUser", "Admin"));
        Assert.assertFalse(rolesService.isRoleAuthorised("isAdminUser", "U1"));
        Assert.assertFalse(rolesService.isRoleAuthorised("isAdminUser", "userNotFound"));
        Assert.assertTrue(rolesService.isRoleAuthorised("isDevUser", "U1"));
        Assert.assertFalse(rolesService.isRoleAuthorised("isDevUser", null));
        Assert.assertFalse(rolesService.isRoleAuthorised("isDevUser", ""));

        Assert.assertFalse(rolesService.isRoleAuthorised("isLogin", null));
        Assert.assertFalse(rolesService.isRoleAuthorised("isLogin", ""));
        Assert.assertTrue(rolesService.isRoleAuthorised("isLogin", "U1"));
        Assert.assertFalse(rolesService.isRoleAuthorised("isLogin", "InvalidUsername"));


        Assert.assertFalse(rolesService.isRoleAuthorised("isBooleanTrue", null));
        Assert.assertFalse(rolesService.isRoleAuthorised("isBooleanTrue", ""));
        // username does not exist in roles config
        Assert.assertFalse(rolesService.isRoleAuthorised("isBooleanTrue", "username"));

        Assert.assertFalse(rolesService.isRoleAuthorised("isDevUserNotFound", "U1"));

        Assert.assertTrue(rolesService.isRoleAuthorised("isAdminOrDevUser", "U1"));
        Assert.assertTrue(rolesService.isRoleAuthorised("isAdminOrDevUser", "Admin"));
        Assert.assertTrue(rolesService.isRoleAuthorised("isAdminAndDevUser", "adminAndDev"));
        Assert.assertFalse(rolesService.isRoleAuthorised("isAdminOrDevUser", "Admin1"));
        Assert.assertFalse(rolesService.isRoleAuthorised("inValidRoleEntry", "Admin"));
        Assert.assertFalse(rolesService.isRoleAuthorised("inValidRoleEntry2", "Admin"));


        Assert.assertTrue(rolesService.isRoleAuthorised("isUploadFileEnable", "U1"));
        Assert.assertTrue(rolesService.isRoleAuthorised("isAddTextEnable", "U1"));


        Assert.assertFalse(rolesService.isRoleAuthorised("isUploadFileEnableNotFound", "username"));
        Assert.assertFalse(rolesService.isRoleAuthorised("isAddTextEnableNotFound", "username"));

//        Assert.assertEquals("((admin|dev)|(admin|dev))", rolesService.getRolesByApiName("isAdminOrDevUser"));
    }

}
