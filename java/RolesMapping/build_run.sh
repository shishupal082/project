#!/usr/bin/env bash

echo *****Start building application*****

mvn clean install

echo *****Build complete*****

echo *****Copying jar file*****
rm current-build/RolesMapping-*.jar
cp target/RolesMapping-*.jar current-build/
#rm -rf target
echo *****Copy jar file completed*****

#Copying new build file
sh copy_build.sh
