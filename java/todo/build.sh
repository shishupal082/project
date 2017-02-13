#!/usr/bin/env bash
echo *****Start building application*****
rm meta-data/todo-*.jar
mvn clean install
cp target/todo-*.jar meta-data/
rm -rf target
echo *****Build complete*****
