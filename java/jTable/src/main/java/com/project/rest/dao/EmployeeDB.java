package com.project.rest.dao;

import com.project.rest.representations.Employee;
import com.project.rest.service.DateService;

import java.util.ArrayList;
import java.util.HashMap;

public class EmployeeDB {
    public static HashMap<Integer, Employee> employees = new HashMap<Integer, Employee>();
    static{
        employees.put(1, new Employee(1, "Lokesh", 20, "2023-04-02"));
        employees.put(2, new Employee(2, "John", 22, "2023-04-02"));
        employees.put(3, new Employee(3, "Melcum", 23, "2023-04-02"));
    }
    public ArrayList<Employee> getEmployees(){
        return new ArrayList<Employee>(employees.values());
    }
    private int getNewPersonId() {
        int maxId = 0;
        ArrayList<Employee> employees = this.getEmployees();
        Employee employee;
        for (int i=0; i<employees.size(); i++) {
            employee = employees.get(i);
            if (maxId < employee.getPersonId()) {
                maxId = employee.getPersonId();
            }
        }
        return maxId + 1;
    }
    public Employee getEmployee(Integer id){
        return employees.get(id);
    }
    public Employee createEmployee(String name, Integer age){
        Integer personId = this.getNewPersonId();
        String recordDate = DateService.getDateStrFromPattern("YYYY-MM-DD");
        Employee employee = new Employee(personId, name, age, recordDate);
        employees.put(personId, employee);
        return employee;
    }
    public void updateEmployee(Integer id, Employee employee){
        employees.put(id, employee);
    }
    public void removeEmployee(Integer id){
        employees.remove(id);
    }
}
