package com.todo.response;

import com.todo.model.Todo;

/**
 * Created by shishupalkumar on 26/12/16.
 */
public class TodoResponse {
    private Todo todo;

    public Todo getTodo() {
        return todo;
    }

    public void setTodo(Todo todo) {
        this.todo = todo;
    }

    @Override
    public String toString() {
        return "TodoResponse{" +
            "todo=" + todo +
            '}';
    }
}
