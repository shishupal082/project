package com.project.dao;

import com.project.config.AppConstant;
import com.project.obj.Employee;
import com.project.obj.MysqlUser;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

public class DbDAO extends AbstractDAO<Employee> {
    private static final Logger logger = LoggerFactory.getLogger(DbDAO.class);
    public DbDAO(SessionFactory sessionFactory) {
        super(sessionFactory);
    }
    public List<Employee> findAllEmployee() {
        List<Employee> list = new ArrayList<>();
        String queryName = AppConstant.FindAllEmployee;
        try {
            list = (List<Employee>) namedQuery(queryName).getResultList();
            logger.info("result count: {}", list.size());
        } catch (Exception e) {
            logger.info("error in query: {}, {}", queryName, e.getMessage());
            e.printStackTrace();
        }
        return list;
    }
    public List<MysqlUser> findAllUser() {
        List<MysqlUser> list = null;
        String queryName = AppConstant.FindAllUser;
        try {
            list = (List<MysqlUser>) namedQuery(queryName).getResultList();
            logger.info("result count: {}", list.size());
        } catch (Exception e) {
            logger.info("error in query: {}, {}", queryName, e.getMessage());
            e.printStackTrace();
        }
        return list;
    }
    public List<Employee> findEmployeeByName(String name) {
        StringBuilder builder = new StringBuilder("%");
        builder.append(name).append("%");
        List<Employee> list = new ArrayList<>();
        String queryName = AppConstant.FindEmployeeByName;
        try {
            list = (List<Employee>) namedQuery(queryName)
                    .setParameter("name", builder.toString()).getResultList();
            logger.info("result count: {}", list.size());
        } catch (Exception e) {
            logger.info("error in query: {}, {}", queryName, e.getMessage());
            e.printStackTrace();
        }
        return list;
    }
    public List<MysqlUser> findUserByName(String name) {
        StringBuilder builder = new StringBuilder("%");
        builder.append(name).append("%");
        List<MysqlUser> list = new ArrayList<>();
        String queryName = AppConstant.FindUserByName;
        try {
            list = (List<MysqlUser>) namedQuery(queryName).setParameter("name", builder.toString()).getResultList();
            logger.info("result count: {}", list.size());
        } catch (Exception e) {
            logger.info("error in query: {}, {}", queryName, e.getMessage());
            e.printStackTrace();
        }
        return list;
    }
}
