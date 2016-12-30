package com.todo.model;

/**
 * Created by shishupalkumar on 30/12/16.
 */
public class Todo {
    private Integer id;
    private String subject;
    private String description;
    private TodoStatus status;
    private TodoPriority priority;
    private TodoType type;
    public Todo() {}
    public Todo(Integer id, String subject, String description, TodoStatus status,
                TodoPriority priority, TodoType todoType) {
        this.id = id;
        this.subject = subject;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.type = todoType;

    }
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TodoStatus getStatus() {
        return status;
    }

    public void setStatus(TodoStatus status) {
        this.status = status;
    }

    public TodoPriority getPriority() {
        return priority;
    }

    public void setPriority(TodoPriority priority) {
        this.priority = priority;
    }

    public TodoType getType() {
        return type;
    }

    public void setType(TodoType type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "Todo{" +
            "id=" + id +
            ", subject='" + subject + '\'' +
            ", description='" + description + '\'' +
            ", status=" + status +
            ", priority=" + priority +
            ", type=" + type +
            '}';
    }
}
