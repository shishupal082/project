#!/usr/bin/env bash

echo "***** Syncing Start *****"

oldFilesDir=()
oldFilesDir+=(../../java/yard/src/main/resources/assets/yard1/js/)
oldFilesDir+=(../../java/yard/src/main/resources/assets/yard1/json/)

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


cp -r static/js/* ../../java/yard/src/main/resources/assets/yard1/js/
cp -r static/json/* ../../java/yard/src/main/resources/assets/yard1/json/

echo "***** Syncing End *****"
