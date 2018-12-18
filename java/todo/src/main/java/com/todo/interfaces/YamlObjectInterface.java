package com.todo.interfaces;

import com.todo.model.YamlObjectDB;
import com.todo.yaml.todo.YamlObject;

public interface YamlObjectInterface {
    YamlObjectDB getYamlObjectDB(YamlObject yamlObject);
}
