#!/usr/bin/env bash

#Copying old build file
sh copy_build.sh


echo *****Start building application*****

mvn clean install

echo *****Build complete*****

echo *****Copying jar file*****
rm meta-data/Communication-*.jar
cp target/Communication-*.jar meta-data/
#rm -rf target
echo *****Copy jar file completed*****


#Copying new build file
sh copy_build.sh
# shellcheck disable=SC2162
read -p "Press enter to exit."
