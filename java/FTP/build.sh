#!/usr/bin/env bash

echo *****Start building application*****

mvn clean install
rm meta-data/FTP-*.jar
cp target/FTP-*.jar meta-data/
#rm -rf target

echo *****Build complete*****

sh copy_build.sh
