package com.todo.model;

import com.todo.yaml.todo.Command;
import com.todo.yaml.todo.Commands;

import java.util.ArrayList;

public class CommandsDB {
    private ArrayList<Command> commandList;

    public ArrayList<Command> getCommandList() {
        return commandList;
    }

    public void setCommandList(ArrayList<Command> commandList) {
        this.commandList = commandList;
    }
    public void updateCommandsDBFromCommands(Commands commands) {
        if (commands != null && commands.getCommandList() != null) {
            if (commandList != null) {
                commandList.addAll(commands.getCommandList());
            } else {
                commandList = commands.getCommandList();
            }
        }
    }
    @Override
    public String toString() {
        return "CommandsDB{" +
                "commandList=" + commandList +
                '}';
    }
}
