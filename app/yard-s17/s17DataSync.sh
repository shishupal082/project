#!/usr/bin/env bash

echo "***** Syncing Start *****"

oldFilesDir=()
oldFilesDir+=(../../java/yard/src/main/resources/assets/s17/css/)
oldFilesDir+=(../../java/yard/src/main/resources/assets/s17/js/)
oldFilesDir+=(../../java/yard/src/main/resources/assets/s17/json/)

oldFilesDir+=(../../java/yard/src/main/resources/assets/static/libs/)
oldFilesDir+=(../../java/yard/src/main/resources/assets/static/js/)

loopEndCount=$((${#oldFilesDir[*]}))

for ((c=0; c<$loopEndCount; c++))
  do
    d=${oldFilesDir[$c]}
    if [ -d "$d" ]; then
        rm -rf "${d}*"
    else
      echo "Destination directory '${d}' does not exist."
    fi
done

cp ../yard1/static/css/* ../../java/yard/src/main/resources/assets/s17/css/

cp -r static/js/* ../../java/yard/src/main/resources/assets/s17/js/
cp -r static/json/* ../../java/yard/src/main/resources/assets/s17/json/

cp ../../static/libs/bootstrap-v3.1.1.css ../../java/yard/src/main/resources/assets/static/libs/
cp ../../static/libs/jquery-2.1.3.js ../../java/yard/src/main/resources/assets/static/libs/

cp ../../static/js/stack.js ../../java/yard/src/main/resources/assets/static/js/
cp ../../static/js/model.js ../../java/yard/src/main/resources/assets/static/js/
cp ../../static/js/yard/yardApiModel.js ../../java/yard/src/main/resources/assets/static/js/

echo "***** Syncing End *****"
