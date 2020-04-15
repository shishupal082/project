#!/usr/bin/env bash
echo *****Start building application*****

mvn clean install
rm meta-data/yard-*.jar
cp target/yard-*.jar meta-data/
rm -rf target

echo [INFO] Copying file to desired location

rm -rf ../../yard-app/*
mkdir ../../yard-app/meta-data
cp readme.txt ../../yard-app/
cp run_app.bat ../../yard-app/
cp meta-data/yard-*.jar ../../yard-app/meta-data/
cp meta-data/app_env_config.yml ../../yard-app/meta-data/

echo *****Build complete*****
