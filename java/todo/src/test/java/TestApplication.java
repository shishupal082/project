import com.todo.utils.StringUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by shishupalkumar on 01/11/17.
 */
public class TestApplication {
    public static void Test_StringUtils_sortObjectArray() {
        System.out.println("Test_StringUtils_sortObjectArray");
        ArrayList<Map<String, Object>> r = new ArrayList<Map<String, Object>>();
        HashMap<String, Object> o = new HashMap<String, Object>();
        StringUtils.sortObjectArray(null, null);
        StringUtils.sortObjectArray(r, null);
        r.add(o);
        StringUtils.sortObjectArray(r, null);
        StringUtils.sortObjectArray(r, "id");
        r.add(o);
        StringUtils.sortObjectArray(r, "id");
    }
    public static void main(String[] args) throws Exception {
        Test_StringUtils_sortObjectArray();
    }
}
