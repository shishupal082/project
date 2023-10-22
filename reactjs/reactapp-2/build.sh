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


# distDir_na=dist-monitoring-app (Depricated)

# distDir=dist-index-app
# distDir=dist-yard-app
# distDir=dist-management-app
# distDir=dist-search-app
# distDir=dist-account-app-2021-oct
# distDir=dist-auth-demo-app
# distDir=dist-assets-app
# distDir=dist-data-entry-app
# distDir=dist-data-display-app
# distDir=dist-ml2-app
# distDir=dist-ftp-app
distDir=dist-project-tracking-app
# distDir=dist-auth-app
# distDir=dist-rcc-app
# distDir=dist-attendance-app
# distDir=dist-google_login-app
# distDir=dist-track-plan-app
# distDir=dist-mastersheet-app



sh sync.sh

addLog "Dist directory: ${distDir}"

addLog "*****Start building application*****"

npm run build

addLog "*****Build complete*****"

# passing distDir as argument
sh copy_build.sh $distDir

