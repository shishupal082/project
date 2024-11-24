#!/usr/bin/env bash

echo *****Start building application*****

mvn clean install

echo *****Build complete*****

echo *****Copying jar file*****
rm final_copy/FileParser-*.jar
cp target/FileParser-*.jar final_copy/
#rm -rf target
echo *****Copy jar file completed*****

#sh app_run.bat

#Copying new build file
#sh copy_build.sh
read -p "Press enter to exit."
