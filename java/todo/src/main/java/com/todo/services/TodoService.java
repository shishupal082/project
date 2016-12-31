package com.todo.services;

import com.todo.model.Todo;
import com.todo.model.TodoDatabase;
import com.todo.response.TodoActionResponse;
import com.todo.response.TodoResponse;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by shishupalkumar on 26/12/16.
 */
public class TodoService {
    private TodoDatabase todoDatabase;
    public TodoService(TodoDatabase todoDatabase) {
        this.todoDatabase = todoDatabase;
    }
    public TodoResponse getTodoById(final String todoId) {
        TodoResponse todoResponse = new TodoResponse();
        Map<Integer, Todo> todoMap = todoDatabase.getTodoMap();
        todoResponse.setTodo(todoMap.get(Integer.parseInt(todoId)));
        return todoResponse;
    }
    public List<TodoActionResponse> getTodoActionByTodoId(final String todoId) {
        return null;
    }
}
