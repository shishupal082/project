package com.project.resource;

import com.project.config.AppConstant;
import com.project.obj.ApiResponse;
import com.project.service.EmployeeService;
import io.dropwizard.hibernate.UnitOfWork;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/employees")
@Produces(MediaType.APPLICATION_JSON)
public class EmployeeResource {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeResource.class);
    final EmployeeService employeeService;

    public EmployeeResource(final EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GET
    @UnitOfWork
    public Response getEmployees() {
        logger.info("getEmployees: In");
        ApiResponse apiResponse = employeeService.getAllEmployees();
        logger.info("getEmployees: Out, {}", apiResponse);
        return Response.ok(apiResponse).build();
    }

    @GET
    @Path("/update_email")
    @UnitOfWork
    public ApiResponse updateEmployeeEmail() {
        logger.info("updateEmployeeEmail : In");
        ApiResponse response = employeeService.updateAllEmployeeEmail();
        logger.info("updateEmployeeEmail : Out, {}", response);
        return response;
    }

    @GET
    @UnitOfWork
    @Path("/get/{name}")
    public ApiResponse getEmployeeByFirstNameOrLastName(@PathParam("name") String name) {
        logger.info("getUserByFirstNameOrLastName in: {}", name);
        ApiResponse apiResponse;
        try {
            apiResponse = employeeService.getEmployeeByFirstNameOrLastName(name);
        } catch (Exception e) {
            logger.info("Error in getUserByFirstName: {}", e.getMessage());
            apiResponse = new ApiResponse();
            apiResponse.setStatus(AppConstant.FAILURE);
            apiResponse.setReason(e.getMessage());
            e.printStackTrace();
        }
        logger.info("getUserByFirstNameOrLastName out: {}", apiResponse);
        return apiResponse;
    }

    @GET
    @Path("/update_employee_email/{name}")
    @UnitOfWork
    public ApiResponse updateEmployeeEmail(@PathParam("name") String name) {
        logger.info("updateEmployeeEmail : In, name={}", name);
        ApiResponse response = employeeService.updateEmployeeEmail(name);
        logger.info("updateEmployeeEmail : Out, {}", response);
        return response;
    }

    @GET
    @UnitOfWork
    @Path("/create/{name}")
    public Response createEmployee(@PathParam("name") String name) {
        logger.info("createEmployee : In, name={}", name);
        ApiResponse apiResponse = employeeService.createEmployee(name);
        logger.info("createEmployee : Out, {}", apiResponse);
        return Response.ok(apiResponse).build();
    }
}
