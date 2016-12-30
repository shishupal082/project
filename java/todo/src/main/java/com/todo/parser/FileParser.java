package com.todo.parser;

import com.todo.model.*;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;

/**
 * Created by shishupalkumar on 30/12/16.
 */
public class FileParser implements TodoDbParser {
    public TodoDatabase getTodoDatabase() {
        Map<Integer, Todo> todoMap = getTodoMap();
        Map<String, TodoUser> todoUserMap = getTodoUserMap();
        Map<Integer, TodoEvent> todoEventMap = getTodoEventMap();
        Map<Integer, TodoComment> todoCommentMap = getTodoCommentMap();
        Map<Integer, TodoUpdate> todoUpdateMap = getTodoUpdateMap();
        return new TodoDatabase(todoMap, todoUserMap, todoEventMap, todoCommentMap, todoUpdateMap);
    }
    private List<String> tokanizeLine (String line, String delimator){
        List<String> lst = new ArrayList<String>();
        StringTokenizer st = new StringTokenizer(line, delimator);
        while (st.hasMoreElements()){
            lst.add(st.nextToken());
        }
        return lst;
    }
    private Map<Integer, Todo> getTodoMap() {
        Map<Integer, Todo> todoMap = new HashMap<Integer, Todo>();
        String filePath = System.getProperty("user.dir").concat("/src/main/java/com/todo/parser/todo.data");
        BufferedReader bufferedReader = null;
        try {
            bufferedReader = new BufferedReader(new FileReader(filePath));
            String line = bufferedReader.readLine();
            while (line != null) {
                List<String> tokens = this.tokanizeLine(line, "|");
                Iterator<String> itr = tokens.iterator();
                Todo todo = new Todo();
                if (tokens.size() < 6) {
                    continue;
                }
                todo.setId(Integer.parseInt(itr.next()));
                todo.setSubject(itr.next());
                todo.setStatus(TodoStatus.valueOf(itr.next()));
                todo.setPriority(TodoPriority.valueOf(itr.next()));
                todo.setType(TodoType.valueOf(itr.next()));
                todo.setDescription(itr.next());
                todoMap.put(todo.getId(), todo);
                line = bufferedReader.readLine();
            }
        } catch (IOException ioe) {
            //
        }
        return todoMap;
    }
    private Map<String, TodoUser> getTodoUserMap() {
        Map<String, TodoUser> todoUserMap = new HashMap<String, TodoUser>();
        String filePath = System.getProperty("user.dir").concat("/src/main/java/com/todo/parser/user.data");
        BufferedReader bufferedReader = null;
        try {
            bufferedReader = new BufferedReader(new FileReader(filePath));
            String line = bufferedReader.readLine();
            while (line != null) {
                List<String> tokens = this.tokanizeLine(line, "|");
                Iterator<String> itr = tokens.iterator();
                TodoUser todoUser = new TodoUser();
                if (tokens.size() < 4) {
                    continue;
                }
                todoUser.setId(Integer.parseInt(itr.next()));
                todoUser.setUserId(itr.next());
                todoUser.setEmail(itr.next());
                todoUser.setFull_name(itr.next());
                todoUserMap.put(todoUser.getUserId(), todoUser);
                line = bufferedReader.readLine();
            }
        } catch (IOException ioe) {
            //
        }
        return todoUserMap;
    }
    private Map<Integer, TodoEvent> getTodoEventMap() {
        Map<Integer, TodoEvent> todoEventMap = new HashMap<Integer, TodoEvent>();
        String filePath = System.getProperty("user.dir").concat("/src/main/java/com/todo/parser/event.data");
        BufferedReader bufferedReader = null;
        try {
            bufferedReader = new BufferedReader(new FileReader(filePath));
            String line = bufferedReader.readLine();
            while (line != null) {
                List<String> tokens = this.tokanizeLine(line, "|");
                Iterator<String> itr = tokens.iterator();
                TodoEvent todoEvent = new TodoEvent();
                if (tokens.size() < 4) {
                    continue;
                }
                todoEvent.setId(Integer.parseInt(itr.next()));
                todoEvent.setUpdateId(Integer.parseInt(itr.next()));
                todoEvent.setType(TodoEventType.valueOf(itr.next()));
                todoEvent.setFieldName(itr.next());
                todoEvent.setValue(itr.next());
                todoEvent.setPreviousValue(itr.hasNext() ? itr.next() : null);
                todoEventMap.put(todoEvent.getId(), todoEvent);
                line = bufferedReader.readLine();
            }
        } catch (IOException ioe) {
            //
        }
        return todoEventMap;
    }

    private Map<Integer, TodoComment> getTodoCommentMap() {
        Map<Integer, TodoComment> todoCommentMap = new HashMap<Integer, TodoComment>();
        String filePath = System.getProperty("user.dir").concat("/src/main/java/com/todo/parser/comment.data");
        BufferedReader bufferedReader = null;
        try {
            bufferedReader = new BufferedReader(new FileReader(filePath));
            String line = bufferedReader.readLine();
            while (line != null) {
                List<String> tokens = this.tokanizeLine(line, "|");
                Iterator<String> itr = tokens.iterator();
                TodoComment todoComment = new TodoComment();
                if (tokens.size() < 3) {
                    continue;
                }
                todoComment.setId(Integer.parseInt(itr.next()));
                todoComment.setUpdateId(Integer.parseInt(itr.next()));
                todoComment.setComment(itr.next());
                todoCommentMap.put(todoComment.getId(), todoComment);
                line = bufferedReader.readLine();
            }
        } catch (IOException ioe) {
            //
        }
        return todoCommentMap;
    }
    private Map<Integer, TodoUpdate> getTodoUpdateMap() {
        Map<Integer, TodoUpdate> todoUpdateMap = new HashMap<Integer, TodoUpdate>();
        String filePath = System.getProperty("user.dir").concat("/src/main/java/com/todo/parser/update_details.data");
        BufferedReader bufferedReader = null;
        try {
            bufferedReader = new BufferedReader(new FileReader(filePath));
            String line = bufferedReader.readLine();
            while (line != null) {
                List<String> tokens = this.tokanizeLine(line, "|");
                Iterator<String> itr = tokens.iterator();
                TodoUpdate todoUpdate = new TodoUpdate();
                if (tokens.size() < 4) {
                    continue;
                }
                todoUpdate.setId(Integer.parseInt(itr.next()));
                todoUpdate.setTodoId(Integer.parseInt(itr.next()));
                todoUpdate.setTodoUpdateType(TodoUpdateType.valueOf(itr.next()));
                todoUpdateMap.put(todoUpdate.getId(), todoUpdate);
                line = bufferedReader.readLine();
            }
        } catch (IOException ioe) {
            //
        }
        return todoUpdateMap;
    }
}
