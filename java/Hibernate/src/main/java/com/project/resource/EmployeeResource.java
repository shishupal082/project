package com.project.resource;

import com.project.dao.DbDAO;
import io.dropwizard.hibernate.UnitOfWork;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/employees")
@Produces(MediaType.APPLICATION_JSON)
public class EmployeeResource {

    private final DbDAO dbDAO;

    public EmployeeResource(final DbDAO dbDAO) {
        this.dbDAO = dbDAO;
    }

    @GET
    @UnitOfWork
    public Response getEmployees() {
        return Response.ok(dbDAO.findAllEmployee()).build();
    }
    @GET
    @UnitOfWork
    @Path("/{name}")
    public Response getEmployees(@PathParam("name") String name) {
        return Response.ok(dbDAO.findUserByName(name)).build();
    }

//    @GET
//    @Path("/{id}")
//    public Response getEmployeeById(@PathParam("id") Integer id) {
//        Employee employee = EmployeeDAO.getEmployee(id);
//        if (employee != null)
//            return Response.ok(employee).build();
//        else
//            return Response.status(Status.NOT_FOUND).build();
//    }

}
