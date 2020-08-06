package com.project.representations;



import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Objects;

@Entity // Pojo is mapped to table
@Table(name="users")
@NamedQueries({
        @NamedQuery(name = "MysqlUser.findAll",
                query = "select e from MysqlUser e"),
        @NamedQuery(name = "MysqlUser.findByUsername",
                query = "select e from MysqlUser e "
                        + "where e.username = :name")
})



public class MysqlUser implements Serializable {
    /**
     * Entity's unique identifier.
     */
    @Id
    @NotNull
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "mobile")
    private String mobile;

    @Column(name = "email")
    private String email;

    @Column(name = "name")
    private String name;

    @Column(name = "passcode")
    private String passcode;

    @Column(name = "method")
    private String method;

    @Column(name = "timestamp")
    private String timestamp;

    @Column(name = "deleted")
    private boolean deleted;

    public MysqlUser() {}

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPasscode() {
        return passcode;
    }

    public void setPasscode(String passcode) {
        this.passcode = passcode;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, username, password, mobile, email, name, passcode, method, timestamp, deleted);
    }
    @Override
    public String toString() {
        return "MysqlUser{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", mobile='" + mobile + '\'' +
                ", email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", passcode='" + passcode + '\'' +
                ", method='" + method + '\'' +
                ", timestamp='" + timestamp + '\'' +
                ", deleted=" + deleted +
                '}';
    }
}
