package com.project.service;

import com.project.config.AppConstant;
import com.project.dao.EmployeeDAO;
import com.project.obj.ApiResponse;
import com.project.obj.Employee;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

public class EmployeeService {
    private static final Logger logger = LoggerFactory.getLogger(EmployeeService.class);
    final EmployeeDAO employeeDAO;

    public EmployeeService(final EmployeeDAO employeeDAO) {
        this.employeeDAO = employeeDAO;
    }

    private void updateEmployeeEmailById(Integer id, Employee employee) {
        employeeDAO.updateEmployeeEmail(id, employee.getEmail());
    }

    private void updateEmployeeEmailByIdV2(Integer id, String email) {
        employeeDAO.updateEmployeeEmail(id, email);
    }

    public ApiResponse findAllEmployee() {
        List<Employee> employees = employeeDAO.findAllEmployee();
        ApiResponse apiResponse = new ApiResponse(employees);
        return apiResponse;
    }

    public ApiResponse getAllEmployees() {
        ApiResponse apiResponse;
        List<Employee> employees = employeeDAO.findAllEmployee();
        if (employees == null) {
            apiResponse = new ApiResponse("No employees found");
            logger.info("No employees found");
            return apiResponse;
        }
        return new ApiResponse(employees);
    }

    public ApiResponse getEmployeeByFirstNameOrLastName(String name) {
        ApiResponse apiResponse = new ApiResponse();
        if (name == null) {
            apiResponse.setStatus(AppConstant.FAILURE);
            apiResponse.setReason("name is null.");
            logger.info("getEmployeeByFirstNameOrLastName fail response: {}, name is null", apiResponse);
            return apiResponse;
        }
        List<Employee> list = employeeDAO.findEmployeeByName(name);
        apiResponse = new ApiResponse(list);
        return apiResponse;
    }

    private void updateEmployeeEmail(List<Employee> employees) {
        if (employees == null) {
            return;
        }
        String currentDateTime = StaticService.getDateStrFromPattern(AppConstant.DATE_TIME_FORMATE);
        for (Employee employee : employees) {
            String email = employee.getFirstName() + "." + employee.getLastName()
                    + "." + currentDateTime + "@email";
            logger.info("Email generated: {}, for firstName: {}", email, employee.getFirstName());
            employee.setEmail(email);
        }
    }

    public ApiResponse updateAllEmployeeEmail() {
        ApiResponse apiResponse;
        List<Employee> list = employeeDAO.findAllEmployee();
        if (list != null) {
            this.updateEmployeeEmail(list);
            apiResponse = new ApiResponse(list);
        } else {
            apiResponse = new ApiResponse("result is not list");
        }
        return apiResponse;
    }

    public ApiResponse updateEmployeeEmail(String firstName) {
        ApiResponse apiResponse = new ApiResponse();
        if (firstName == null) {
            apiResponse.setStatus(AppConstant.FAILURE);
            logger.info("updateEmployeeEmail fail response: {}, firstName is null", apiResponse);
            return apiResponse;
        }
        List<Employee> list = employeeDAO.findEmployeeByName(firstName);
        if (list != null) {
            this.updateEmployeeEmail(list);
            apiResponse.setStatus(AppConstant.SUCCESS);
            apiResponse.setData(list);
        } else {
            apiResponse.setStatus(AppConstant.FAILURE);
            apiResponse.setReason("result is not list");
        }
        return apiResponse;
    }

    public ApiResponse createEmployee(String firstName) {
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setStatus(AppConstant.SUCCESS);
        employeeDAO.insertEmployee(firstName, firstName);
        return apiResponse;
    }
}
