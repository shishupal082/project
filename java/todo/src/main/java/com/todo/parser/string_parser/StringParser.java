package com.todo.parser.string_parser;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by shishupalkumar on 10/05/17.
 */
public class StringParser {
    private ArrayList<Map<String, Object>> parsedStringValues;
    public StringParser(String str) {
        parsedStringValues = new ArrayList<Map<String, Object>>();
        if (str == null) {
            return;
        }
        String[] strings = str.split("\\|");
        String[] keyPair;
        String key, valueType;
        for (String str1: strings) {
            HashMap<String, Object> value = new HashMap<String, Object>();
            String[] str2 = str1.split("=");
            keyPair = str2.length > 0 ? str2[0].split(":") : null;
            if (keyPair == null || keyPair.length < 2) {
                value.put("key", "id");
                value.put("valueType", "string");
                value.put("value", str);
                parsedStringValues.add(value);
                continue;
            }
            key =  keyPair[0];
            valueType = keyPair[1];
            value.put("key", key);
            value.put("valueType", valueType);
            if ("string".equals(valueType)) {
                value.put("value", str2.length > 1 ? str2[1] : null);
            } else if ("string[]".equals(valueType)) {
                value.put("value", str2.length > 1 ? str2[1].split(",") : null);
            }
            parsedStringValues.add(value);
        }
    }
    public Object getValue(String key) {
        if (key == null) {
            return null;
        }
        for (Map<String, Object> obj: parsedStringValues) {
            if (key.equals(obj.get("key"))) {
                return obj.get("value");
            }
        }
        return null;
    }
}
