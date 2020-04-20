#!/usr/bin/env bash

echo *****Start building application*****

mvn clean install
rm -rf meta-data/mavenProject-*.jar
mv target/mavenProject-*.jar meta-data/
echo *****Build complete*****

sh run.sh
