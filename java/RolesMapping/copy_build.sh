#!/usr/bin/env bash

echo [INFO] Copying file to desired location

appVersionDir="D:/workspace/app-data/ftp-app/ftp-app-8.0.2.019/"

# copying to app folder
copyFiles() {
  if [[ ! (-d "${appVersionDir}") ]]; then
    echo "AppVersion dir: ${appVersionDir}, is missing.";
    echo "Copying file failed.";
    return;
  fi

  rm -rf ${appVersionDir}"RolesMapping-*.jar"
  cp current-build/RolesMapping-*.jar ${appVersionDir}
}
copyFiles
echo [INFO] Copy file complete
