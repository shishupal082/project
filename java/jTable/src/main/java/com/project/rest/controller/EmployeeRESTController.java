package com.project.rest.controller;

import com.project.rest.representations.Employee;
import com.project.rest.response.EmployeeResponse;
import com.project.rest.service.EmployeeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.validation.Validator;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;


@Path("/employees")
@Produces(MediaType.APPLICATION_JSON)
public class EmployeeRESTController {
    private final EmployeeService employeeService;
    private static final Logger LOGGER = LoggerFactory.getLogger(EmployeeRESTController.class);
    private final EmployeeResponse employeeResponse;
    public EmployeeRESTController(Validator validator, EmployeeService employeeService) {
        this.employeeService = employeeService;
        this.employeeResponse = new EmployeeResponse();
    }
    @GET
    public Response getEmployees(@QueryParam("jtStartIndex") String startIndex,
                                 @QueryParam("jtPageSize") String pageSize) {
        LOGGER.info("Get Request received: startIndex={}, pageSize={}", startIndex, pageSize);
        return Response.ok(employeeService.getEmployees()).build();
    }
    @POST
    public Response getEmployeesByPost(@QueryParam("jtStartIndex") String startIndex,
                                       @QueryParam("jtPageSize") String pageSize) {
        LOGGER.info("Post Request received: startIndex={}, pageSize={}", startIndex, pageSize);
        ArrayList<Employee> employees = employeeService.getEmployees();
        return Response.ok(employeeResponse.generateAllEmployeeResponse(employees)).build();
    }
    @GET
    @Path("/{id}")
    public Response getEmployeeById(@PathParam("id") Integer id) {
        LOGGER.info("Get Request received with employeeId: {}", id);
        return Response.ok(employeeService.getEmployeeById(id)).build();
    }
    @Path("/create")
    @POST
    public Response createEmployee(@FormParam("name") String name,
                                   @FormParam("age") String age) {
        LOGGER.info("createEmployee Post: name={}, age={}", name, age);
        Employee employee = employeeService.createEmployee(name, age);
        LOGGER.info("Employee created: {}", employee);
        return Response.ok(employeeResponse.generateEmployeeResponse(employee)).build();
    }
}
