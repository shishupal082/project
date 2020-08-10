package com.project.dao;

import com.project.config.AppConstant;
import com.project.jdbc.MysqlConnection;
import com.project.obj.Employee;
import com.project.obj.MysqlUser;
import io.dropwizard.db.DataSourceFactory;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class EmployeeDAO extends AbstractDAO<Employee> {
    private static final Logger logger = LoggerFactory.getLogger(EmployeeDAO.class);
    final SessionFactory sessionFactory;
    final MysqlConnection mysqlConnection;
    public EmployeeDAO(final SessionFactory sessionFactory,
                       final DataSourceFactory dataSourceFactory) {
        super(sessionFactory);
        this.sessionFactory = sessionFactory;
        this.mysqlConnection = new MysqlConnection(dataSourceFactory);
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
    public List<Employee> findEmployeeByNameV2(String firstName) {
        List<Employee> list2 = new ArrayList<>();
        List<ResultSet> list;
        String queryName = AppConstant.FindEmployeeByNameV2;
        String query = "SELECT * FROM employee WHERE firstName = :name";
        try {
            list2 = sessionFactory.getCurrentSession()
                    .createSQLQuery(query)
                    .setParameter("name", firstName)
                    .getResultList();
            logger.info("result count: {}, {}", list2.size(), list2);
            for(Object obj: list2) {
                logger.info("result: {}, {}", obj, obj.toString());
            }
        } catch (Exception e) {
            logger.info("error in query: {}, {}", queryName, e.getMessage());
            e.printStackTrace();
        }
        return list2;
    }
    public void updateEmployeeEmail(Integer id, String email) {
        String queryName = AppConstant.EmployeeUpdateEmail;
        try {
            sessionFactory.getCurrentSession()
                    .createSQLQuery(namedQuery(queryName).getQueryString())
                    .setParameter("id", id)
                    .setParameter("email", email)
                    .executeUpdate();
            logger.info("Employee email: {}, is updated for id: {}", email, id);
        } catch (Exception e) {
            logger.info("error in query: {}, {}", queryName, e.getMessage());
            e.printStackTrace();
        }
    }
    public void insertEmployee(String firstName, String lastName) {
        String queryName = AppConstant.EmployeeInsert;
        String query = "INSERT INTO employee (firstName, lastName) VALUES(:first,:last)";
        try {
            sessionFactory.getCurrentSession()
                    .createSQLQuery(query)
                    .setParameter("first", firstName)
                    .setParameter("last", lastName)
                    .executeUpdate();
        } catch (Exception e) {
            logger.info("error in query: {}, {}", queryName, e.getMessage());
            e.printStackTrace();
        }
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
