package com.todo.interfaces;

import com.todo.model.YamlObjectDB;
import com.todo.yaml.todo.YamlObject;

public class YamlObjectImplements implements YamlObjectInterface {
    public YamlObjectDB getYamlObjectDB(YamlObject yamlObject) {
        return new YamlObjectDB(yamlObject);
    }
}
