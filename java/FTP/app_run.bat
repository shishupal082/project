#!/usr/bin/env bash


now="$(date +'%Y-%m-%d-%H-%M-%S')"

logDir="D:/workspace/project/ftp-app/log"

src=${logDir}/application.log
dest="${logDir}/application-${now}.log"

if [[ -f "$src" ]]; then
	mv $src $dest
else
	echo "Log file does not exit: ${src}"
fi

java -jar meta-data/FTP-*-SNAPSHOT.jar meta-data/app_env_config.yml
