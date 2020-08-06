package com.project.controller;

import com.project.dao.DbDAO;
import io.dropwizard.hibernate.UnitOfWork;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
public class UserRESTController {

    private final DbDAO dbDAO;

    public UserRESTController(DbDAO dbDAO) {
        this.dbDAO = dbDAO;
    }

    @GET
    @UnitOfWork
    public Response getAllUsers() {
        return Response.ok(dbDAO.findAllUser()).build();
    }
    @GET
    @UnitOfWork
    @Path("/{name}")
    public Response getEmployees(@PathParam("name") String name) {
        return Response.ok(dbDAO.findUserByName(name)).build();
    }
}
