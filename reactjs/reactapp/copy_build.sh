#!/usr/bin/env bash

# receive distDir as argument

distDir=$1
reactBase="dist-react-base-1.0.0"

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
addLog "Dist directory: ${distDir}"

if [[ ! (-d "${distDir}") ]]; then
  echo "Dist dir: ${distDir}, is missing.";
  echo "Copying file failed.";
  exit;
fi

if [[ ! (-d "${reactBase}") ]]; then
  echo "React base dir: ${reactBase}, is missing.";
  echo "Copying file failed.";
  exit;
fi


rm -rf ${distDir}/*

cp build/static/js/*.js ${distDir}/

mv ${distDir}/runtime-main.*.js ${reactBase}/script1.js
mv ${distDir}/main.*.chunk.js ${distDir}/script2.js

sed -i "2s/.*//" ${reactBase}/script1.js
sed -i "2s/.*//" ${distDir}/script2.js

requiredScript3=("dist-monitoring-app" "dist-data-display-app" "dist-account-app-2021-oct" "dist-ml2-app")

isNotFound="true"

for i in "${requiredScript3[@]}"
do
    if [ "$i" == "$distDir" ] ; then
        isNotFound="false"
        mv ${distDir}/*.chunk.js ${distDir}/script3.js
        sed -i "3s/.*//" ${distDir}/script3.js
    fi
done

if [[ $isNotFound == "true" ]]; then
  mv ${distDir}/*.chunk.js ${reactBase}/script3.js
  sed -i "3s/.*//" ${reactBase}/script3.js
fi


# if [[ $distDir == "dist-auth-app" ]]; then
  # cp ${distDir}/script1.js ../../../ftp-application/FTP/src/main/resources/assets/static/dist-auth-app/
  # cp ${distDir}/script2.js ../../../ftp-application/FTP/src/main/resources/assets/static/dist-auth-app/
  # cp ${distDir}/script3.js ../../../ftp-application/FTP/src/main/resources/assets/static/dist-auth-app/
# fi


# sed -i  ''  '2s/.*//' ${distDir}/script1.js
# sed -i  ''  '2s/.*//' ${distDir}/script2.js
# sed -i  ''  '3s/.*//' ${distDir}/script3.js

addLog "Copy file complete"
