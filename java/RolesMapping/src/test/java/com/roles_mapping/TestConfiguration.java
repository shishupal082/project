package com.roles_mapping;

import com.roles_mapping.config.BridgeConstant;
import com.roles_mapping.service.AnnotationService;
import com.roles_mapping.service.RoleService;
import org.junit.Assert;
import org.junit.Test;

public class TestConfiguration {
    @Test
    public void testAnnotation() {
        Assert.assertEquals(BridgeConstant.NULL_STR, AnnotationService.getAppVersion(null));
        Assert.assertNull(AnnotationService.getAppVersion(null, null));
        Assert.assertEquals("1.0.0", AnnotationService.getAppVersion(RolesMappingApp.class));
        Assert.assertEquals(BridgeConstant.NULL_STR, AnnotationService.getAppVersion(RoleService.class));
        Assert.assertNull(AnnotationService.getAppVersion(RoleService.class, null));
        Assert.assertEquals("default", AnnotationService.getAppVersion(RoleService.class, "default"));
    }
}
