package com.todo.model;

/**
 * Created by shishupalkumar on 30/12/16.
 */
public class TodoUpdate {
    private Integer id;
    private Integer todoId;
    private TodoUpdateType todoUpdateType;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getTodoId() {
        return todoId;
    }

    public void setTodoId(Integer todoId) {
        this.todoId = todoId;
    }

    public TodoUpdateType getTodoUpdateType() {
        return todoUpdateType;
    }

    public void setTodoUpdateType(TodoUpdateType todoUpdateType) {
        this.todoUpdateType = todoUpdateType;
    }

    @Override
    public String toString() {
        return "TodoUpdate{" +
            "id=" + id +
            ", todoId=" + todoId +
            ", todoUpdateType=" + todoUpdateType +
            '}';
    }
}
