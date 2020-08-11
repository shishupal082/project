package com.project.service;

import com.project.config.AppConstant;
import com.project.dao.DbDAO;
import com.project.obj.ApiResponse;
import com.project.obj.MysqlUser;

import java.util.List;

public class UserService {
    final DbDAO dbDAO;

    public UserService(final DbDAO dbDAO) {
        this.dbDAO = dbDAO;
    }

    public List<MysqlUser> getAllUsersV2() {
        return dbDAO.findAllUser();
    }

    public ApiResponse getAllUsers() {
        List<MysqlUser> list = dbDAO.findAllUser();
        return new ApiResponse(list);
    }

    private MysqlUser getMysqlUser(String username) {
        List<MysqlUser> list = dbDAO.findUserByName(username);
        MysqlUser result = null;
        if (list != null) {
            for (MysqlUser mysqlUser : list) {
                if (mysqlUser.getUsername().equals(username)) {
                    result = mysqlUser;
                    break;
                }
            }
        }
        return result;
    }

    public ApiResponse updatePassword(String username, String password) {
        MysqlUser mysqlUser = this.getMysqlUser(username);
        if (mysqlUser != null) {
            mysqlUser.setPassword(password);
        }
        return new ApiResponse(mysqlUser);
    }

    public MysqlUser getUserByNameV2(String username) {
        return this.getMysqlUser(username);
    }

    public ApiResponse getUserByName(String username) {
        MysqlUser result = this.getMysqlUser(username);
        return new ApiResponse(result);
    }

    public ApiResponse createUser(String username) {
        ApiResponse apiResponse = new ApiResponse();
        MysqlUser mysqlUser = new MysqlUser(username);
        apiResponse.setReason("user create not implemented");
        apiResponse.setStatus(AppConstant.FAILURE);
        apiResponse.setData(mysqlUser);
        return apiResponse;
    }
}
