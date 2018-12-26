package com.todo.yaml.todo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CommandConfig {
    private ArrayList<String> commandFilePaths;
    private FileConfig commandLogRequestFile;
    private FileConfig commandLogResponseFile;

    public ArrayList<String> getCommandFilePaths() {
        return commandFilePaths;
    }

    public void setCommandFilePaths(ArrayList<String> commandFilePaths) {
        this.commandFilePaths = commandFilePaths;
    }

    public FileConfig getCommandLogRequestFile() {
        return commandLogRequestFile;
    }

    public void setCommandLogRequestFile(FileConfig commandLogRequestFile) {
        this.commandLogRequestFile = commandLogRequestFile;
    }

    public FileConfig getCommandLogResponseFile() {
        return commandLogResponseFile;
    }

    public void setCommandLogResponseFile(FileConfig commandLogResponseFile) {
        this.commandLogResponseFile = commandLogResponseFile;
    }

    @Override
    public String toString() {
        return "CommandConfig{" +
                "commandFilePaths=" + commandFilePaths +
                ", commandLogRequestFile='" + commandLogRequestFile + '\'' +
                ", commandLogResponseFile='" + commandLogResponseFile + '\'' +
                '}';
    }
}
