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

public class TestIsValidCondition {
    private final ExpressionEvaluator testRoles = new ExpressionEvaluator();
    @Test
    public void testCondition() {
        RolesMappingApp rolesMappingApp = new RolesMappingApp();
        String cellData = null;
        ArrayList<String> range = null;
        ArrayList<String> notInRange = null;
        Boolean isEmpty = null;
        String regex = null;
        //Null check
        Boolean result = rolesMappingApp.isValidCondition(null, null, null, null, null);
        Assert.assertNull(result);
        result = rolesMappingApp.isValidCondition("", null, null, null, null);
        Assert.assertNull(result);
        result = rolesMappingApp.isValidCondition("test", null, null, null, null);
        Assert.assertNull(result);
        //Is empty check
        result = rolesMappingApp.isValidCondition(null, null, null, true, null);
        Assert.assertTrue(result);
        result = rolesMappingApp.isValidCondition("", null, null, true, null);
        Assert.assertTrue(result);
        result = rolesMappingApp.isValidCondition("test", null, null, true, null);
        Assert.assertFalse(result);
        //Range check
        range = new ArrayList<>();
        result = rolesMappingApp.isValidCondition(null, range, null, null, null);
        Assert.assertFalse(result);
        result = rolesMappingApp.isValidCondition("", range, null, null, null);
        Assert.assertFalse(result);
        result = rolesMappingApp.isValidCondition("test", range, null, null, null);
        Assert.assertFalse(result);
        range.add("");
        result = rolesMappingApp.isValidCondition("", range, null, null, null);
        Assert.assertTrue(result);
        range.add(null);
        result = rolesMappingApp.isValidCondition(null, range, null, null, null);
        Assert.assertTrue(result);
        result = rolesMappingApp.isValidCondition("test", range, null, null, null);
        Assert.assertFalse(result);
    }
}
