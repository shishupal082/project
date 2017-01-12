package com.todo;

import com.todo.config.TestConfig;
import com.todo.config.TodoConfig;
import io.dropwizard.Configuration;
import lombok.Data;

/**
 * Created by shishupalkumar on 11/01/17.
 */
@Data
public class TodoConfiguration extends Configuration {
    private TestConfig testConfig;

    public TodoConfig getTodoConfig() {
        return todoConfig;
    }

    public void setTodoConfig(TodoConfig todoConfig) {
        this.todoConfig = todoConfig;
    }

    private TodoConfig todoConfig;

    public TestConfig getTestConfig() {
        return testConfig;
    }

    public void setTestConfig(TestConfig testConfig) {
        this.testConfig = testConfig;
    }
}
