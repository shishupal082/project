#!/usr/bin/env bash

echo *****Start building application*****

mvn clean install
rm meta-data/yard-*.jar
cp target/yard-*.jar meta-data/
rm -rf target

echo *****Build complete*****

sh copy_build.sh
