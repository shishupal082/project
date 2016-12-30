package com.todo.model;

/**
 * Created by shishupalkumar on 26/12/16.
 */
public class TodoEvent {
    private Integer id;
    private Integer updateId;
    private TodoEventType type;
    private String fieldName;
    private String value;
    private String previousValue;
    public TodoEvent() {}
    public TodoEvent(Integer id, Integer updateId, TodoEventType type,
                     String fieldName, String value, String previousValue) {
        this.id = id;
        this.updateId = updateId;
        this.type = type;
        this.fieldName = fieldName;
        this.value = value;
        this.previousValue = previousValue;
    }

    @Override
    public String toString() {
        return "TodoEvent{" +
            "id=" + id +
            ", updateId=" + updateId +
            ", type=" + type +
            ", fieldName='" + fieldName + '\'' +
            ", value='" + value + '\'' +
            ", previousValue='" + previousValue + '\'' +
            '}';
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUpdateId() {
        return updateId;
    }

    public void setUpdateId(Integer updateId) {
        this.updateId = updateId;
    }

    public TodoEventType getType() {
        return type;
    }

    public void setType(TodoEventType type) {
        this.type = type;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getPreviousValue() {
        return previousValue;
    }

    public void setPreviousValue(String previousValue) {
        this.previousValue = previousValue;
    }
}
