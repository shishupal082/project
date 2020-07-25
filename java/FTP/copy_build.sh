#!/usr/bin/env bash

echo [INFO] Copying file to desired location

appVersionDir="../../ftp-app/ftp-app-1.0.4"
metaDataDir=${appVersionDir}"/meta-data/"
savedFilesDir=${appVersionDir}"/saved-files/"

# copying to app folder
copyFiles() {
  if [[ ! (-d "${appVersionDir}") ]]; then
    echo "AppVersion dir: "${appVersionDir}", is missing.";
    echo "Copying file failed.";
    return;
  fi
  if [[ ! (-d "${metaDataDir}") ]]; then
    echo "metaDataDir dir: ${metaDataDir}, is missing.";
    mkdir $metaDataDir
    echo "Dir: ${metaDataDir} created.";
  fi
  if [[ ! (-d "${savedFilesDir}") ]]; then
    echo "savedFilesDir dir: ${savedFilesDir}, is missing.";
    mkdir $savedFilesDir
    echo "Dir: ${savedFilesDir} created.";
  fi
  cp readme.pdf ${appVersionDir}
  cp user_guide.pdf ${appVersionDir}
  cp run.bat ${appVersionDir}

  rm -rf ${metaDataDir}"*"

  cp meta-data/saved-files/app_static_data.json ${savedFilesDir}
  cp meta-data/saved-files/user_data.csv ${savedFilesDir}
  cp meta-data/favicon.ico ${metaDataDir}
  cp meta-data/env_config.yml ${metaDataDir}
  cp meta-data/FTP-*.jar ${metaDataDir}
}
copyFiles
echo [INFO] Copy file complete
