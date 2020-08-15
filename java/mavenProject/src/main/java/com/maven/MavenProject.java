package com.maven;

import com.maven.common.AppConstant;
import com.maven.common.StaticService;
import com.maven.jsonSerializeAnnotation.TestJsonSerialize;
import com.maven.passwordAnnotation.Login;
import com.maven.testAnnotation.TestProgram;

import java.util.ArrayList;
import java.util.Arrays;

public class MavenProject {
    public static void main(String[] args) {
        ArrayList<String> arguments = new ArrayList<String>();
        if (args != null) {
            arguments.addAll(Arrays.asList(args));
        }
        StaticService.printLog("Program start, size: " + arguments.size() + ", arguments: " + arguments.toString());

        StaticService.printLog(AppConstant.TEST_SEPARATE);
        Login.test();
//        StaticService.printLog(AppConstant.TEST_SEPARATE);
//        TestProgram.test();
//        StaticService.printLog(AppConstant.TEST_SEPARATE);
//        TestProgram.testV2();
//        StaticService.printLog(AppConstant.TEST_SEPARATE);
//        TestJsonSerialize.test();
    }
}
