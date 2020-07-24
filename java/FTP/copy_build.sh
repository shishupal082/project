#!/usr/bin/env bash

echo [INFO] Copying file to desired location

rm meta-data/FTP-*.jar
cp target/FTP-*.jar meta-data/
#rm -rf target

# copying to app folder

cp readme.pdf ../../ftp-app/ftp-app-1.0.3/
cp run.bat ../../ftp-app/ftp-app-1.0.3/

rm -rf ../../ftp-app/ftp-app-1.0.3/meta-data/*


cp meta-data/favicon.ico ../../ftp-app/ftp-app-1.0.3/meta-data/
cp meta-data/env_config.yml ../../ftp-app/ftp-app-1.0.3/meta-data/
cp meta-data/FTP-*.jar ../../ftp-app/ftp-app-1.0.3/meta-data/

echo [INFO] Copy file complete
