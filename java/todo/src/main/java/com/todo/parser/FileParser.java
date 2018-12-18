package com.todo.parser;

import com.todo.config.TodoFileConfig;
import com.todo.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;

/**
 * Created by shishupalkumar on 30/12/16.
 */
public class FileParser implements TodoDbParser {
    private static Logger logger = LoggerFactory.getLogger(FileParser.class);
    private TodoFileConfig todoFileConfig;
    private String todoDataFileName;
    private String todoUserFileName;
    private String todoEventFileName;
    private String todoCommentFileName;
    private String todoUpdateFileName;
    public TodoDatabase getTodoDatabase(TodoFileConfig todoFileConfigs) {
        this.todoFileConfig = todoFileConfigs;
        todoUpdateFileName = todoFileConfig.getTodoUpdateFileName();
        todoDataFileName = todoFileConfig.getTodoFileName();
        todoUserFileName = todoFileConfig.getTodoUserFileName();
        todoEventFileName = todoFileConfig.getTodoEventFileName();
        todoCommentFileName = todoFileConfig.getTodoCommentFileName();
        Map<Integer, Todo> todoMap = getTodoMap();
        Map<String, TodoUser> todoUserMap = getTodoUserMap();
        Map<Integer, TodoEvent> todoEventMap = getTodoEventMap();
        Map<Integer, TodoComment> todoCommentMap = getTodoCommentMap();
        Map<Integer, TodoUpdate> todoUpdateMap = getTodoUpdateMap();
        return new TodoDatabase(todoMap, todoUserMap, todoEventMap, todoCommentMap, todoUpdateMap);
    }
    private List<String> tokanizeLine (String line){
        String delimator = todoFileConfig.getDelimator();
        List<String> lst = new ArrayList<String>();
        StringTokenizer st = new StringTokenizer(line, delimator);
        while (st.hasMoreElements()){
            lst.add(st.nextToken());
        }
        return lst;
    }
    private Map<Integer, Todo> getTodoMap() {
        Map<Integer, Todo> todoMap = new HashMap<Integer, Todo>();
        BufferedReader bufferedReader = null;
        try {
            bufferedReader = new BufferedReader(new FileReader(todoDataFileName));
            String line;
            while ((line=bufferedReader.readLine()) != null) {
                List<String> tokens = this.tokanizeLine(line);
                Iterator<String> itr = tokens.iterator();
                Todo todo = new Todo();
                if (tokens.size() < 6) {
                    logger.info("Invalid line in {} : {}",todoDataFileName, line);
                    continue;
                }
                todo.setId(Integer.parseInt(itr.next()));
                todo.setSubject(itr.next());
                todo.setStatus(TodoStatus.valueOf(itr.next()));
                todo.setPriority(TodoPriority.valueOf(itr.next()));
                todo.setType(TodoType.valueOf(itr.next()));
                todo.setDescription(itr.next());
                todoMap.put(todo.getId(), todo);
            }
        } catch (IOException ioe) {
            //
        }
        return todoMap;
    }
    private Map<String, TodoUser> getTodoUserMap() {
        Map<String, TodoUser> todoUserMap = new HashMap<String, TodoUser>();
        BufferedReader bufferedReader = null;
        try {
            bufferedReader = new BufferedReader(new FileReader(todoUserFileName));
            String line;
            while ((line=bufferedReader.readLine()) != null) {
                List<String> tokens = this.tokanizeLine(line);
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
            }
        } catch (IOException ioe) {
            //
        }
        return todoUserMap;
    }
    private Map<Integer, TodoEvent> getTodoEventMap() {
        Map<Integer, TodoEvent> todoEventMap = new HashMap<Integer, TodoEvent>();
        BufferedReader bufferedReader = null;
        try {
            bufferedReader = new BufferedReader(new FileReader(todoEventFileName));
            String line;
            while ((line=bufferedReader.readLine()) != null) {
                List<String> tokens = this.tokanizeLine(line);
                Iterator<String> itr = tokens.iterator();
                TodoEvent todoEvent = new TodoEvent();
                if (tokens.size() < 4) {
                    continue;
                }
                todoEvent.setId(Integer.parseInt(itr.next()));
                todoEvent.setUpdateId(Integer.parseInt(itr.next()));
                String previousValue = itr.next();
                todoEvent.setType(previousValue != null ? TodoEventType.valueOf(previousValue.toUpperCase()) : null);
                todoEvent.setFieldName(itr.next());
                todoEvent.setValue(itr.next());
                todoEvent.setPreviousValue(itr.hasNext() ? itr.next() : null);
                todoEventMap.put(todoEvent.getId(), todoEvent);
            }
        } catch (IOException ioe) {
            //
        }
        return todoEventMap;
    }

    private Map<Integer, TodoComment> getTodoCommentMap() {
        Map<Integer, TodoComment> todoCommentMap = new HashMap<Integer, TodoComment>();
        BufferedReader bufferedReader = null;
        try {
            bufferedReader = new BufferedReader(new FileReader(todoCommentFileName));
            String line;
            while ((line=bufferedReader.readLine()) != null) {
                List<String> tokens = this.tokanizeLine(line);
                Iterator<String> itr = tokens.iterator();
                TodoComment todoComment = new TodoComment();
                if (tokens.size() < 3) {
                    continue;
                }
                todoComment.setId(Integer.parseInt(itr.next()));
                todoComment.setUpdateId(Integer.parseInt(itr.next()));
                todoComment.setComment(itr.next());
                todoCommentMap.put(todoComment.getId(), todoComment);
            }
        } catch (IOException ioe) {
            //
        }
        return todoCommentMap;
    }
    private Map<Integer, TodoUpdate> getTodoUpdateMap() {
        Map<Integer, TodoUpdate> todoUpdateMap = new HashMap<Integer, TodoUpdate>();
        BufferedReader bufferedReader = null;
        try {
            bufferedReader = new BufferedReader(new FileReader(todoUpdateFileName));
            String line;
            while ((line=bufferedReader.readLine()) != null) {
                List<String> tokens = this.tokanizeLine(line);
                Iterator<String> itr = tokens.iterator();
                TodoUpdate todoUpdate = new TodoUpdate();
                if (tokens.size() < 4) {
                    continue;
                }
                todoUpdate.setId(Integer.parseInt(itr.next()));
                todoUpdate.setTodoId(Integer.parseInt(itr.next()));
                todoUpdate.setTodoUpdateType(TodoUpdateType.valueOf(itr.next().toUpperCase()));
                todoUpdateMap.put(todoUpdate.getId(), todoUpdate);
            }
        } catch (IOException ioe) {
            //
        }
        return todoUpdateMap;
    }
}
