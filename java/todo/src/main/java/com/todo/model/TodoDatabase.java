package com.todo.model;

import java.util.Map;

/**
 * Created by shishupalkumar on 30/12/16.
 */
public class TodoDatabase {
    private Map<Integer, Todo> todoMap;
    private Map<String, TodoUser> todoUserMap;
    private Map<Integer, TodoEvent> todoEventMap;
    private Map<Integer, TodoComment> todoCommentMap;
    private Map<Integer, TodoUpdate> todoUpdateMap;

    @Override
    public String toString() {
        return "TodoDatabase{" +
            "todoMap=" + todoMap +
            ", todoUserMap=" + todoUserMap +
            ", todoEventMap=" + todoEventMap +
            ", todoCommentMap=" + todoCommentMap +
            ", todoUpdateMap=" + todoUpdateMap +
            '}';
    }

    public TodoDatabase(Map<Integer, Todo> todoMap, Map<String, TodoUser> todoUserMap,
                        Map<Integer, TodoEvent> todoEventMap,
                        Map<Integer, TodoComment> todoCommentMap,
                        Map<Integer, TodoUpdate> todoUpdateMap) {
        this.todoMap = todoMap;
        this.todoUserMap = todoUserMap;
        this.todoEventMap = todoEventMap;
        this.todoCommentMap = todoCommentMap;
        this.todoUpdateMap = todoUpdateMap;
    }

    public Map<Integer, Todo> getTodoMap() {
        return todoMap;
    }

    public void setTodoMap(Map<Integer, Todo> todoMap) {
        this.todoMap = todoMap;
    }

    public Map<String, TodoUser> getTodoUserMap() {
        return todoUserMap;
    }

    public void setTodoUserMap(Map<String, TodoUser> todoUserMap) {
        this.todoUserMap = todoUserMap;
    }

    public Map<Integer, TodoEvent> getTodoEventMap() {
        return todoEventMap;
    }

    public void setTodoEventMap(Map<Integer, TodoEvent> todoEventMap) {
        this.todoEventMap = todoEventMap;
    }

    public Map<Integer, TodoComment> getTodoCommentMap() {
        return todoCommentMap;
    }

    public void setTodoCommentMap(Map<Integer, TodoComment> todoCommentMap) {
        this.todoCommentMap = todoCommentMap;
    }

    public Map<Integer, TodoUpdate> getTodoUpdateMap() {
        return todoUpdateMap;
    }

    public void setTodoUpdateMap(Map<Integer, TodoUpdate> todoUpdateMap) {
        this.todoUpdateMap = todoUpdateMap;
    }
}
