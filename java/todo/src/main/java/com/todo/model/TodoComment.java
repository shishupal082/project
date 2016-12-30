package com.todo.model;

/**
 * Created by shishupalkumar on 30/12/16.
 */
public class TodoComment {
    private Integer id;
    private Integer updateId;
    private String comment;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUpdateId() {
        return updateId;
    }

    public void setUpdateId(Integer updateId) {
        this.updateId = updateId;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    @Override
    public String toString() {
        return "TodoComment{" +
            "id=" + id +
            ", updateId=" + updateId +
            ", comment='" + comment + '\'' +
            '}';
    }
}
