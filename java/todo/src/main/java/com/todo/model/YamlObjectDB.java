package com.todo.model;

import com.todo.yaml.todo.YamlObject;

public class YamlObjectDB {
    private YamlObject yamlObject;
    public YamlObjectDB(YamlObject yamlObject){
        this.yamlObject = yamlObject;
    }

    public YamlObject getYamlObject() {
        return yamlObject;
    }
}
