package com.todo.services;

import com.todo.model.*;
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
    private TodoComment getTodoCommentByUpdateId(Integer updateId) {
        Map<Integer, TodoComment> todoCommentMap = todoDatabase.getTodoCommentMap();
        for (TodoComment todoComment : todoCommentMap.values()) {
            if (todoComment.getUpdateId().equals(updateId)) {
                return todoComment;
            }
        }
        return null;
    }
    private List<TodoEvent> getTodoEventByUpdateId(Integer updateId) {
        Map<Integer, TodoEvent> todoEventMap = todoDatabase.getTodoEventMap();
        List<TodoEvent> todoEvents = new ArrayList<TodoEvent>();
        for (TodoEvent todoEvent : todoEventMap.values()) {
            if (todoEvent.getUpdateId().equals(updateId)) {
                todoEvents.add(todoEvent);
            }
        }
        return todoEvents;
    }
    public List<TodoActionResponse> getTodoActionByTodoId(final String todoId) {
        List<TodoActionResponse> todoActionResponses = new ArrayList<TodoActionResponse>();
        Map<Integer, TodoUpdate> todoUpdateMap = todoDatabase.getTodoUpdateMap();
        for (TodoUpdate todoUpdate : todoUpdateMap.values()) {
            if (todoUpdate.getTodoId() == Integer.parseInt(todoId)) {
                TodoActionResponse todoActionResponse = new TodoActionResponse();
                todoActionResponse.setUpdateId(todoUpdate.getId());
                TodoComment todoComment = getTodoCommentByUpdateId(todoUpdate.getId());
                List<TodoEvent> todoEvents = getTodoEventByUpdateId(todoUpdate.getId());
                todoActionResponse.setTodoEvents(todoEvents);
                if (todoComment != null) {
                    todoActionResponse.setComment(todoComment);
                }
                if (todoComment != null || todoEvents.size() > 0) {
                    todoActionResponses.add(todoActionResponse);
                }
            }
        }
        return todoActionResponses;
    }
}
