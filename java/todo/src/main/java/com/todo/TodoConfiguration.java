package com.todo;

import com.todo.config.TestConfig;
import com.todo.config.TodoFileConfig;
import io.dropwizard.Configuration;
import lombok.Data;

/**
 * Created by shishupalkumar on 11/01/17.
 */
@Data
public class TodoConfiguration extends Configuration {
    private TestConfig testConfig;

    public TodoFileConfig getTodoFileConfig() {
        return todoFileConfig;
    }

    public void setTodoFileConfig(TodoFileConfig todoFileConfig) {
        this.todoFileConfig = todoFileConfig;
    }

    private TodoFileConfig todoFileConfig;

    public TestConfig getTestConfig() {
        return testConfig;
    }

    public void setTestConfig(TestConfig testConfig) {
        this.testConfig = testConfig;
    }
}