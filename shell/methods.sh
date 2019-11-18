#!/bin/sh
src=methods.sh
marker=**********

logFile=../../logs/log.txt
key=$(($RANDOM%99999+10000))
isLogFileFound=false

addLog() {
  now=$(date +"%Y-%m-%d %T")
  echo "${now} $1"
  if [[ $isLogFileFound == true ]]; then
    echo "${now} $key $1" >> $logFile
  fi
}

if [ -f "$logFile" ]; then
  isLogFileFound=true
  addLog "Source file '${src}'"
else
  echo "${now} logFile '${logFile}' does not exist."
fi

addLog "${marker} START ${marker}"
addLog "Current directory: $(pwd)"
addLog "${marker} END ${marker}"

read -p "Press enter to exit."
