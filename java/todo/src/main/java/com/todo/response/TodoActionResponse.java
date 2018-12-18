package com.todo.response;

import com.todo.model.TodoComment;
import com.todo.model.TodoEvent;
import com.todo.model.TodoUser;

import java.util.List;

/**
 * Created by shishupalkumar on 26/12/16.
 */
public class TodoActionResponse {
    private Integer updateId; // Todo update id
    private TodoUser user;
    private TodoComment comment;
    private List<TodoEvent> todoEvents;

    public Integer getUpdateId() {
        return updateId;
    }

    public void setUpdateId(Integer updateId) {
        this.updateId = updateId;
    }

    public TodoUser getUser() {
        return user;
    }

    public void setUser(TodoUser user) {
        this.user = user;
    }

    public TodoComment getComment() {
        return comment;
    }

    public void setComment(TodoComment comment) {
        this.comment = comment;
    }

    public List<TodoEvent> getTodoEvents() {
        return todoEvents;
    }

    public void setTodoEvents(List<TodoEvent> todoEvents) {
        this.todoEvents = todoEvents;
    }

    @Override
    public String toString() {
        return "TodoActionResponse{" +
            "updateId=" + updateId +
            ", user=" + user +
            ", comment=" + comment +
            ", todoEvents=" + todoEvents +
            '}';
    }
}
