package com.project.rest.representations;

public class Employee {
    private Integer personId;
    private String name;
    private Integer age;
    private String recordDate;
    public Employee(){}
    public Employee(Integer personId, String name, Integer age, String recordDate) {
        this.personId = personId;
        this.name = name;
        this.age = age;
        this.recordDate = recordDate;
    }

    public Integer getPersonId() {
        return personId;
    }

    public void setPersonId(Integer personId) {
        this.personId = personId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getRecordDate() {
        return recordDate;
    }

    public void setRecordDate(String recordDate) {
        this.recordDate = recordDate;
    }

    @Override
    public String toString() {
        return "Employee{" +
                "personId=" + personId +
                ", name='" + name + '\'' +
                ", age=" + age +
                ", recordDate='" + recordDate + '\'' +
                '}';
    }
}
