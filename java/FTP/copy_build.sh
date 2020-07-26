#!/usr/bin/env bash

echo [INFO] Copying file to desired location

appVersionDir="../../ftp-app/ftp-app-1.0.5/"
configDataDir="../../ftp-app/config-files/"
#savedFilesDir=${appVersionDir}"/saved-files/"

# copying to app folder
copyFiles() {
  if [[ ! (-d "${appVersionDir}") ]]; then
    echo "AppVersion dir: ${appVersionDir}, is missing.";
    echo "Copying file failed.";
    return;
  fi
  if [[ ! (-d "${configDataDir}") ]]; then
    echo "configDataDir dir: ${configDataDir}, is missing.";
    echo "Copying file failed.";
    return;
  fi
#  if [[ ! (-d "${savedFilesDir}") ]]; then
#    echo "savedFilesDir dir: ${savedFilesDir}, is missing.";
#    mkdir $savedFilesDir
#    echo "Dir: ${savedFilesDir} created.";
#  fi

  rm -rf ${appVersionDir}"*"
  cp readme.pdf ${appVersionDir}
  cp user_guide.pdf ${appVersionDir}
  cp run.bat ${appVersionDir}
  cp meta-data/FTP-*.jar ${appVersionDir}

  cp meta-data/config-files/env_config.yml ${configDataDir}
  cp meta-data/config-files/favicon.ico ${configDataDir}
#  cp meta-data/config-files/user_data.csv ${configDataDir}
#  cp meta-data/config-files/app_static_data.json ${configDataDir}


#  cp meta-data/saved-files/app_static_data.json ${savedFilesDir}
#  cp meta-data/saved-files/user_data.csv ${savedFilesDir}
#  cp meta-data/favicon.ico ${metaDataDir}
#  cp meta-data/env_config.yml ${metaDataDir}

}
copyFiles
echo [INFO] Copy file complete
