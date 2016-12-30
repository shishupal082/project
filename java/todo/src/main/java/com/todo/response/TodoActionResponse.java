package com.todo.response;

import com.todo.model.TodoUser;
import com.todo.model.TodoEvent;

import java.util.List;

/**
 * Created by shishupalkumar on 26/12/16.
 */
public class TodoActionResponse {
    private TodoUser user;
    private TodoEvent comment;
    private List<String> uploaded_files;
    private List<TodoEvent> events;
}
