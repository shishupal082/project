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
        ApiResponse apiResponse = employeeService.findAllEmployee();
        return Response.ok(apiResponse).build();
    }

    @GET
    @UnitOfWork
    @Path("/get/{name}")
    public ApiResponse getEmployees(@PathParam("name") String firstName) {
        logger.info("getEmployees in");
        ApiResponse apiResponse;
        try {
            apiResponse = employeeService.updateEmployeeEmail(firstName);
        } catch (Exception e) {
            logger.info("Error in updating email: {}", e.getMessage());
            apiResponse = new ApiResponse();
            apiResponse.setStatus(AppConstant.FAILURE);
            apiResponse.setReason(e.getMessage());
            e.printStackTrace();
        }
        logger.info("getEmployees out: {}", apiResponse);
        return apiResponse;
    }

    @GET
    @UnitOfWork
    @Path("/create/{name}")
    public Response insertEmployee(@PathParam("name") String name) {
        ApiResponse apiResponse = employeeService.createEmployee(name);
        return Response.ok(apiResponse).build();
    }
}
