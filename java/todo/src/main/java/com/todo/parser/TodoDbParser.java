package com.todo.parser;

import com.todo.config.TodoFileConfig;
import com.todo.model.TodoDatabase;

/**
 * Created by shishupalkumar on 30/12/16.
 */
public interface TodoDbParser {
    TodoDatabase getTodoDatabase(TodoFileConfig todoFileConfig);
}
