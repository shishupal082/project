#!/usr/bin/env bash

echo [INFO] Copying file to desired location

appVersionDir="../../comm-app/comm-app-1.0.0/"

# copying to app folder
copyFiles() {
  if [[ ! (-d "${appVersionDir}") ]]; then
    echo "AppVersion dir: ${appVersionDir}, is missing.";
    echo "Copying file failed.";
    return;
  fi
  rm -rf ${appVersionDir}"*"
  cp run_server.bat ${appVersionDir}
  cp run_client.bat ${appVersionDir}
  cp readme.txt ${appVersionDir}
  cp meta-data/Communication-*.jar ${appVersionDir}
}
copyFiles
echo [INFO] Copy file complete
# shellcheck disable=SC2162
#read -p "Press enter to exit."
