#!/usr/bin/env bash
echo *****Start building application*****
mvn clean install
rm meta-data/todo-*.jar
cp target/todo-*.jar meta-data/
rm -rf target
echo *****Build complete*****
