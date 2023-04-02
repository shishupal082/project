package com.project.rest.service;

import com.project.rest.JTable;
import com.project.rest.dao.EmployeeDB;
import com.project.rest.representations.Employee;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;

public class EmployeeService {
    private static final Logger LOGGER = LoggerFactory.getLogger(EmployeeService.class);
    private final EmployeeDB employeeDB;
    public EmployeeService(EmployeeDB employeeDB) {
        this.employeeDB = employeeDB;
    }
    public ArrayList<Employee> getEmployees() {
        return employeeDB.getEmployees();
    }
    public Employee getEmployeeById(Integer personId) {
        Employee employee = employeeDB.getEmployee(personId);
        LOGGER.info("EmployeeId: {}, employee: {}", personId, employee);
        return employee;
    }
    public Employee createEmployee(String name, String age) {
        if (name == null || age == null) {
            return null;
        }
        Employee employee = null;
        int ageInt = 0;
        try {
            ageInt = Integer.parseInt(age, 10);
            employee = employeeDB.createEmployee(name, ageInt);
        } catch (Exception e) {
            LOGGER.info("Error in creating employee.");
        }
        return employee;
    }
}
