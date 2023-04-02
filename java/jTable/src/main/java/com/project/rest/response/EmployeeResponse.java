package com.project.rest.response;

import com.project.rest.representations.Employee;

import java.util.ArrayList;
import java.util.HashMap;

public class EmployeeResponse {

    public EmployeeResponse() {}

    public HashMap<String, Object> generateAllEmployeeResponse(ArrayList<Employee> employees) {
        HashMap<String, Object> result = new HashMap<>();
        if (employees != null && employees.size() > 0) {
            result.put("Result", "OK");
            result.put("Records", employees);
            result.put("TotalRecordCount", employees.size());
        } else {
            result.put("Result", "ERROR");
            result.put("Records", null);
            result.put("TotalRecordCount", 0);
        }
        return result;
    }
    public HashMap<String, Object> generateEmployeeResponse(Employee employee) {
        HashMap<String, Object> result = new HashMap<>();
        if (employee != null) {
            result.put("Result", "OK");
            result.put("Record", employee);
        } else {
            result.put("Result", "ERROR");
            result.put("Record", null);
        }
        return result;
    }
}
