#!/usr/bin/env bash

echo [INFO] Copying file to desired location

rm -rf ../../web-app/*
mkdir ../../web-app/meta-data

cp readme.txt ../../web-app/
cp run.bat ../../web-app/

cp meta-data/favicon.ico ../../web-app/meta-data/
cp meta-data/env_config.yml ../../web-app/meta-data/
cp meta-data/WebApp-*.jar ../../web-app/meta-data/

echo [INFO] Copy file complete
