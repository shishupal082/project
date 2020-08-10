package com.project.resource;

import com.project.dao.DbDAO;
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
    private final DbDAO dbDAO;

    public EmployeeResource(final DbDAO dbDAO, final EmployeeService employeeService) {
        this.dbDAO = dbDAO;
        this.employeeService = employeeService;
    }

    @GET
    @UnitOfWork
    public Response getEmployees() {
        return Response.ok(dbDAO.findAllEmployee()).build();
    }

    @GET
    @UnitOfWork
    @Path("/get/{name}")
    public Response getEmployees(@PathParam("name") String name) {
        employeeService.updateEmployeeEmail(name);
        return Response.ok(dbDAO.findEmployeeByName(name)).build();
    }

    @GET
    @UnitOfWork
    @Path("/create/{name}")
    public Response insertEmployee(@PathParam("name") String name) {
        ApiResponse apiResponse = employeeService.createEmployee(name);
        return Response.ok(apiResponse).build();
    }
}
