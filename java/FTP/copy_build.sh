#!/usr/bin/env bash

echo [INFO] Copying file to desired location

rm -rf ../../ftp-app/meta-data/*

cp readme.txt ../../ftp-app/
cp run.bat ../../ftp-app/

cp meta-data/favicon.ico ../../ftp-app/meta-data/
cp meta-data/env_config.yml ../../ftp-app/meta-data/
cp meta-data/FTP-*.jar ../../ftp-app/meta-data/

echo [INFO] Copy file complete
