package com.roles_mapping;

import com.roles_mapping.config.BridgeConstant;
import com.roles_mapping.service.AnnotationService;
import com.roles_mapping.service.RoleService;
import org.junit.Assert;
import org.junit.Test;

public class TestConfiguration {
    @Test
    public void testAnnotation() {
        Assert.assertEquals("1.0.0", AnnotationService.getAppVersion(RolesMappingApp.class));
        Assert.assertEquals(BridgeConstant.NULL_STR, AnnotationService.getAppVersion(RoleService.class));
        Assert.assertEquals("default", AnnotationService.getAppVersion(RoleService.class, "default"));
    }
}
