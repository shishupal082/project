#!/usr/bin/env bash

echo *****Start building application*****

mvn clean install

echo *****Build complete*****

sh copy_build.sh
sh app_run.bat

cp readme.pdf ../../ftp-app/ftp-app-1.0.0/
