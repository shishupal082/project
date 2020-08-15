package com.maven.passwordAnnotation;
import lombok.Builder;
import lombok.Value;

import javax.validation.constraints.Pattern;

//@Value
@Builder
public class User {
    @Pattern(regexp ="^[a-zA-z]+$", message = "should be alpha numeric")
    private String username;

    @Password
    private String password;

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "User{" +
                "username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}