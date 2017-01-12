package com.todo.config;

/**
 * Created by shishupalkumar on 12/01/17.
 */
public class TodoFileConfig {
    private String delimator;
    private String todoFileName;
    private String todoUserFileName;
    private String todoEventFileName;
    private String todoUpdateFileName;
    private String todoCommentFileName;

    public String getTodoFileName() {
        return todoFileName;
    }

    public void setTodoFileName(String todoFileName) {
        this.todoFileName = todoFileName;
    }

    public String getTodoUserFileName() {
        return todoUserFileName;
    }

    public void setTodoUserFileName(String todoUserFileName) {
        this.todoUserFileName = todoUserFileName;
    }

    public String getTodoEventFileName() {
        return todoEventFileName;
    }

    public void setTodoEventFileName(String todoEventFileName) {
        this.todoEventFileName = todoEventFileName;
    }

    public String getTodoUpdateFileName() {
        return todoUpdateFileName;
    }

    public void setTodoUpdateFileName(String todoUpdateFileName) {
        this.todoUpdateFileName = todoUpdateFileName;
    }

    public String getTodoCommentFileName() {
        return todoCommentFileName;
    }

    public void setTodoCommentFileName(String todoCommentFileName) {
        this.todoCommentFileName = todoCommentFileName;
    }

    public String getDelimator() {
        return delimator;
    }

    public void setDelimator(String delimator) {
        this.delimator = delimator;
    }
}
