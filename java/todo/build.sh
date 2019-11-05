#!/usr/bin/env bash
echo *****Start building application*****

mvn clean install
rm meta-data/todo-*.jar
cp target/todo-*.jar meta-data/
rm -rf target

echo [INFO] Copying file to desired location

rm -rf ../../todo
mkdir ../../todo
mkdir ../../todo/meta-data
mkdir ../../todo/meta-data/config
cp readme.txt ../../todo/
cp meta-data/todo-*.jar ../../todo/meta-data/
cp meta-data/config/env_config.yml ../../todo/meta-data/config/
cp meta-data/config/env_config_custom_logging.yaml ../../todo/meta-data/config/
cp meta-data/config/yaml_object.yaml ../../todo/meta-data/config/
cp meta-data/config/available_resources.yaml ../../todo/meta-data/config/

echo *****Build complete*****
