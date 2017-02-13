package app;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by shishupalkumar on 13/02/17.
 */
public class StrToArray {
    public static void main(String[] args) {
        String data = "{\"name\":\"user\",\"data\":\"{\"name\":\"user\"}\"}\"";
        Map<String, String> map = new HashMap<String, String>();
        map.put("details", data);
        System.out.println(map);
        System.out.println(map.get("details"));
    }
}
