#!/usr/bin/env bash
echo *****Start building application*****

mvn clean install
rm meta-data/todo-*.jar
cp target/todo-*.jar meta-data/
rm -rf target

echo [INFO] Copying file to desired location

rm -rf ../../todo-app
mkdir ../../todo-app
mkdir ../../todo-app/meta-data
mkdir ../../todo-app/meta-data/config
cp readme.txt ../../todo-app/
cp meta-data/todo-*.jar ../../todo-app/meta-data/
cp meta-data/config/env_config.yml ../../todo-app/meta-data/config/
cp meta-data/config/env_config_custom_logging.yaml ../../todo-app/meta-data/config/
cp meta-data/config/yaml_object.yaml ../../todo-app/meta-data/config/
cp meta-data/config/available_resources.yaml ../../todo-app/meta-data/config/

echo *****Build complete*****
