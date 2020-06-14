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

addLog "Copying dependent file to desired location"

# sed -i  ''  "1s/.*/import $\\S from '.\\/stack';/" ./src/libs/model.js
# sed -i  ''  "1s/.*/import '.\\/model'; var $\\M = window.$\\M;/" ./src/libs/yardApiModel.js

sed -i "1s/.*/import $\\S from '.\\/stack';/" ./src/libs/model.js
sed -i "1s/.*/import '.\\/model'; var $\\M = window.$\\M;/" ./src/libs/yardApiModel.js


addLog "Copy file complete"
