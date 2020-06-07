#!/usr/bin/env bash

key=$(($RANDOM%99999+10000))
logFile=/var/log/project/shell_log/cmdlog.log

addLog() {
  now=$(date +"%Y-%m-%d %T")
  if [ -f "$logFile" ]; then
    echo "${now} $1"
    echo "${now} $key $1" >> $logFile
  else
    # * represent log file is not found
    echo "${now}[*] $1"
  fi
}

addLog "Copying file to desired location"

distDir=dist-index-app
distDir=dist-yard-app
distDir=dist-management-app
distDir=dist-account-app

rm -rf ${distDir}/*

cp build/static/js/*.js ${distDir}/

mv ${distDir}/runtime-main.*.js ${distDir}/script1.js
mv ${distDir}/main.*.chunk.js ${distDir}/script2.js
mv ${distDir}/*.chunk.js ${distDir}/script3.js

sed -i  ''  '2s/.*//' ${distDir}/script1.js
sed -i  ''  '2s/.*//' ${distDir}/script2.js
sed -i  ''  '3s/.*//' ${distDir}/script3.js

addLog "Copy file complete"
