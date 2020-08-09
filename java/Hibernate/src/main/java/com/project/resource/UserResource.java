package com.project.resource;

import com.project.dao.DbDAO;
import com.project.obj.ApiResponse;
import com.project.service.UserService;
import io.dropwizard.hibernate.UnitOfWork;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
public class UserResource {

    private final UserService userService;
    public UserResource(final DbDAO dbDAO) {
        this.userService = new UserService(dbDAO);
    }

    @GET
    @UnitOfWork
    public Response getAllUsers() {
        ApiResponse apiResponse = userService.getAllUsers();
        return Response.ok(apiResponse).build();
    }
    @GET
    @UnitOfWork
    @Path("/get/{username}")
    public Response getEmployees(@PathParam("username") String username) {
        ApiResponse apiResponse = userService.getUserByName(username);
        return Response.ok(apiResponse).build();
    }
    @GET
    @UnitOfWork
    @Path("/set/{username}/{password}")
    public Response updatePassword(@PathParam("username") String username,
                                   @PathParam("password") String password) {
        ApiResponse apiResponse = userService.updatePassword(username, password);
        return Response.ok(apiResponse).build();
    }
    @GET
    @UnitOfWork
    @Path("/create/{username}")
    public Response createUser(@PathParam("username") String username) {
        ApiResponse apiResponse = userService.createUser(username);
        return Response.ok(apiResponse).build();
    }
}
