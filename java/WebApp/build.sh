#!/usr/bin/env bash

echo *****Start building application*****

mvn clean install
rm meta-data/WebApp-*.jar
cp target/WebApp-*.jar meta-data/
rm -rf target

echo *****Build complete*****

sh copy_build.sh
