#!/usr/bin/env bash

echo [INFO] Copying file to desired location

rm -rf ../../pdf-app/*
mkdir ../../pdf-app/meta-data
mkdir ../../pdf-app/meta-data/pdf-dir

cp readme.pdf ../../pdf-app/meta-data/pdf-dir/
cp readme.pdf ../../pdf-app/
cp run_app.bat ../../pdf-app/

cp meta-data/favicon.ico ../../pdf-app/meta-data/
cp meta-data/env_config.yml ../../pdf-app/meta-data/
cp meta-data/pdf-*.jar ../../pdf-app/meta-data/

echo [INFO] Copy file complete
