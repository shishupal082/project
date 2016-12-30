package com.todo.response;

/**
 * Created by shishupalkumar on 26/12/16.
 */
public class TodoResponse {
    private Integer id;
    private String subject;
    private String discription;
    private String status;
    private String priority;
    private String type;

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDiscription() {
        return discription;
    }

    public void setDiscription(String discription) {
        this.discription = discription;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "Todo{" +
            "subject='" + subject + '\'' +
            ", discription='" + discription + '\'' +
            ", status='" + status + '\'' +
            ", priority='" + priority + '\'' +
            ", type='" + type + '\'' +
            '}';
    }
}
