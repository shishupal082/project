package com.todo;

import com.todo.config.DirectoryConfig;
import com.todo.config.TestConfig;
import com.todo.config.TodoFileConfig;
import com.todo.config.TodoViewConfig;
import com.todo.interfaces.ConfigInterface;
import io.dropwizard.Configuration;

import java.util.ArrayList;

/**
 * Created by shishupalkumar on 11/01/17.
 */

public class TodoConfiguration extends Configuration {
    private TestConfig testConfig;
    private TodoFileConfig todoFileConfig;
    private TodoViewConfig todoViewConfig;
    private DirectoryConfig directoryConfig;
    private String yamlObjectPath;
    private String iniFilePath;
    private String socketRequestDelimiter;
    private ArrayList<String> appConfigPath;
    private String availableResourcePath;
    private ConfigInterface configInterface;
    private String dataStorage;

    public ArrayList<String> getAppConfigPath() {
        return appConfigPath;
    }

    public void setAppConfigPath(ArrayList<String> appConfigPath) {
        this.appConfigPath = appConfigPath;
    }

    public DirectoryConfig getDirectoryConfig() {
        return directoryConfig;
    }

    public void setDirectoryConfig(DirectoryConfig directoryConfig) {
        this.directoryConfig = directoryConfig;
    }

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

    public String getYamlObjectPath() {
        return yamlObjectPath;
    }

    public void setYamlObjectPath(String yamlObjectPath) {
        this.yamlObjectPath = yamlObjectPath;
    }

    public String getIniFilePath() {
        return iniFilePath;
    }

    public void setIniFilePath(String iniFilePath) {
        this.iniFilePath = iniFilePath;
    }

    public String getSocketRequestDelimiter() {
        return socketRequestDelimiter;
    }

    public void setSocketRequestDelimiter(String socketRequestDelimiter) {
        this.socketRequestDelimiter = socketRequestDelimiter;
    }
    public String getAvailableResourcePath() {
        return availableResourcePath;
    }

    public void setAvailableResourcePath(String availableResourcePath) {
        this.availableResourcePath = availableResourcePath;
    }
    public ConfigInterface getConfigInterface() {
        return configInterface;
    }

    public void setConfigInterface(ConfigInterface configInterface) {
        this.configInterface = configInterface;
    }

    public String getDataStorage() {
        return dataStorage;
    }

    public void setDataStorage(String dataStorage) {
        this.dataStorage = dataStorage;
    }
}
