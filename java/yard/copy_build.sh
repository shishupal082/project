#!/usr/bin/env bash

echo [INFO] Copying file to desired location

rm -rf ../../yard-app/*
mkdir ../../yard-app/meta-data
cp readme.pdf ../../yard-app/
cp run_app.bat ../../yard-app/
cp meta-data/yard-*.jar ../../yard-app/meta-data/
cp meta-data/app_env_config.yml ../../yard-app/meta-data/

echo [INFO] Copy file complete
