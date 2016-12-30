package com.todo.model;

/**
 * Created by shishupalkumar on 26/12/16.
 */
public class TodoUser {
    private Integer id;
    private String userId;
    private String email;
    private String fullName;

    public TodoUser() {}
    public TodoUser(Integer id, String userId, String email, String fullName) {
        this.id = id;
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFull_name() {
        return fullName;
    }

    public void setFull_name(String full_name) {
        this.fullName = full_name;
    }

    @Override
    public String toString() {
        return "TodoUser{" +
            "id=" + id +
            ", userId='" + userId + '\'' +
            ", email='" + email + '\'' +
            ", full_name='" + fullName + '\'' +
            '}';
    }
}
