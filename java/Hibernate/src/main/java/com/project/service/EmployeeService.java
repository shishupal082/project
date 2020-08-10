package com.project.service;

import com.project.config.AppConstant;
import com.project.dao.DbDAO;
import com.project.jdbc.MysqlConnection;
import com.project.obj.ApiResponse;
import com.project.resource.EmployeeResource;
import io.dropwizard.db.DataSourceFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class EmployeeService {
    private static final Logger logger = LoggerFactory.getLogger(EmployeeService.class);
    final DbDAO dbDAO;
    final DataSourceFactory dataSourceFactory;
    final MysqlConnection mysqlConnection;
    public EmployeeService(final DbDAO dbDAO, final DataSourceFactory dataSourceFactory) {
        this.dbDAO = dbDAO;
        this.dataSourceFactory = dataSourceFactory;
        this.mysqlConnection = new MysqlConnection(dataSourceFactory);
    }
    public void updateEmployeeEmail(String name) {
        dbDAO.updateEmployeeEmail(1,name+"@email");
    }
    public ApiResponse createEmployee(String firstName) {
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setStatus(AppConstant.SUCCESS);
        dbDAO.insertEmployee(firstName, firstName);
        return apiResponse;
    }
}
