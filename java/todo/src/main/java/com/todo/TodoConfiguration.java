package com.todo;

import com.todo.config.TestConfig;
import com.todo.config.TodoDirectoryConfig;
import com.todo.config.TodoFileConfig;
import com.todo.config.TodoViewConfig;
import io.dropwizard.Configuration;

/**
 * Created by shishupalkumar on 11/01/17.
 */

public class TodoConfiguration extends Configuration {
    private TestConfig testConfig;
    private TodoFileConfig todoFileConfig;
    private TodoDirectoryConfig todoDirectoryConfig;
    private TodoViewConfig todoViewConfig;

    public TodoFileConfig getTodoFileConfig() {
        return todoFileConfig;
    }

    public void setTodoFileConfig(TodoFileConfig todoFileConfig) {
        this.todoFileConfig = todoFileConfig;
    }

    public TestConfig getTestConfig() {
        return testConfig;
    }

    public void setTestConfig(TestConfig testConfig) {
        this.testConfig = testConfig;
    }

    public TodoDirectoryConfig getTodoDirectoryConfig() {
        return todoDirectoryConfig;
    }

    public void setTodoDirectoryConfig(TodoDirectoryConfig todoDirectoryConfig) {
        this.todoDirectoryConfig = todoDirectoryConfig;
    }

    public TodoViewConfig getTodoViewConfig() {
        return todoViewConfig;
    }

    public void setTodoViewConfig(TodoViewConfig todoViewConfig) {
        this.todoViewConfig = todoViewConfig;
    }
}
