package com.todo.yaml.todo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Commands {
    private ArrayList<Command> commandList;

    public ArrayList<Command> getCommandList() {
        return commandList;
    }

    public void setCommandList(ArrayList<Command> commandList) {
        this.commandList = commandList;
    }

    @Override
    public String toString() {
        return "Commands{" +
                "commandList=" + commandList +
                '}';
    }
}
