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
    public ApiResponse updateEmployeeEmail(String firstName) {
        ApiResponse apiResponse = new ApiResponse();
        if (firstName == null) {
            apiResponse.setStatus(AppConstant.FAILURE);
            logger.info("updateEmployeeEmail fail response: {}, firstName is null", apiResponse);
            return apiResponse;
        }
        List<Employee> list = null;
        employeeDAO.findEmployeeByNameV2(firstName);
        logger.info("{}", list);
        if (list != null) {
            for(Employee employee: list) {
                String email = employee.getFirstName() + "." + employee.getLastName() + ".update2@email";
//                employee.setEmail(email);
                this.updateEmployeeEmailByIdV2(employee.getId(), email);
//                employee.setEmail(email);
            }
            apiResponse.setStatus(AppConstant.SUCCESS);
            apiResponse.setData(list);
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
