package com.maven;

import java.util.ArrayList;

public class MavenProject {
    public static void main(String[] args) throws Exception {
        ArrayList<String> arguments = new ArrayList<String>();
        if (args != null) {
            for (int i=0; i<args.length; i++) {
                arguments.add(args[i]);
            }
        }
        System.out.println("Program start, size: " + arguments.size() + ", argurments: " + arguments.toString());
    }
}
