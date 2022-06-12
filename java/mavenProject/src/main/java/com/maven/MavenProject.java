package com.maven;

import com.maven.GoogleSheet.GoogleSheetTest;
import com.maven.common.AppConstant;
import com.maven.common.StaticService;

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
        GoogleSheetTest.Start();
    }
}
