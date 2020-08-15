package com.project.resource;

import com.project.annotation.Authorized;
import com.project.config.AppConstant;
import com.project.dao.DbDAO;
import com.project.obj.ApiResponse;
import com.project.obj.MysqlUser;
import com.project.service.StaticService;
import com.project.service.UserService;
import io.dropwizard.hibernate.UnitOfWork;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
public class UserResource {
    private static final Logger logger = LoggerFactory.getLogger(UserResource.class);

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
    @Authorized
    public Response getEmployees(final HttpServletRequest request, @PathParam("username") String username) {
        ApiResponse apiResponse = userService.getUserByName(username);
        return Response.ok(apiResponse).build();
    }

    @GET
    @Path("/update_user_password/{username}")
    @UnitOfWork
    public ApiResponse updateUserPassword(@PathParam("username") String username) {
        logger.info("updateUserPassword : In, username={}", username);
        MysqlUser u = userService.getUserByNameV2(username);
        u.setEmail(StaticService.getDateStrFromPattern(AppConstant.DATE_TIME_FORMATE));
        ApiResponse response = new ApiResponse(u);
        logger.info("updateUserPassword : Out, {}", response);
        return response;
    }

    @GET
    @Path("/update_password")
    @UnitOfWork
    public ApiResponse updateUsersPassword() {
        logger.info("updateUsersPassword : In");
        List<MysqlUser> u = userService.getAllUsersV2();
        for (MysqlUser u1 : u) {
            u1.setEmail(StaticService.getDateStrFromPattern(AppConstant.DATE_TIME_FORMATE));
        }
        ApiResponse response = new ApiResponse(u);
        logger.info("updateUsersPassword : Out, {}", response);
        return response;
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
