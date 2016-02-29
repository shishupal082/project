package com.test.utils;

import java.util.Random;

/**
 * Created by shishupal.kumar on 03/02/16.
 */
public class Utils {
	public static String getRandomNumber(){
		Random r = new Random();
		int low = 0;
		int high = Integer.MAX_VALUE;
		int result = r.nextInt (high - low) + low;
		return Integer.toString(result);
	}
}
