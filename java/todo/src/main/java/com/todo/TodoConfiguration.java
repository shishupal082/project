package com.todo;

import com.todo.config.FilesConfig;
import com.todo.config.TestConfig;
import com.todo.config.TodoFileConfig;
import com.todo.config.TodoViewConfig;
import io.dropwizard.Configuration;

/**
 * Created by shishupalkumar on 11/01/17.
 */

public class TodoConfiguration extends Configuration {
    private TestConfig testConfig;
    private TodoFileConfig todoFileConfig;
    private TodoViewConfig todoViewConfig;
    private String todoDirectoryConfigPath;
    private String yamlObjectPath;
    private String socketRequestDelimiter;
    private FilesConfig filesConfig;
    private String taskConfigPath;

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

    public TodoViewConfig getTodoViewConfig() {
        return todoViewConfig;
    }

    public void setTodoViewConfig(TodoViewConfig todoViewConfig) {
        this.todoViewConfig = todoViewConfig;
    }

    public String getTodoDirectoryConfigPath() {
        return todoDirectoryConfigPath;
    }

    public void setTodoDirectoryConfigPath(String todoDirectoryConfigPath) {
        this.todoDirectoryConfigPath = todoDirectoryConfigPath;
    }

    public String getYamlObjectPath() {
        return yamlObjectPath;
    }

    public void setYamlObjectPath(String yamlObjectPath) {
        this.yamlObjectPath = yamlObjectPath;
    }

    public String getSocketRequestDelimiter() {
        return socketRequestDelimiter;
    }

    public void setSocketRequestDelimiter(String socketRequestDelimiter) {
        this.socketRequestDelimiter = socketRequestDelimiter;
    }

    public FilesConfig getFilesConfig() {
        return filesConfig;
    }

    public void setFilesConfig(FilesConfig filesConfig) {
        this.filesConfig = filesConfig;
    }

    public String getTaskConfigPath() {
        return taskConfigPath;
    }

    public void setTaskConfigPath(String taskConfigPath) {
        this.taskConfigPath = taskConfigPath;
    }
}
