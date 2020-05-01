#!/usr/bin/env bash

echo [INFO] Copying file to desired location

rm -rf dist/*

cp build/static/js/*.js dist/

mv dist/runtime-main.*.js dist/temp1.js
mv dist/main.*.chunk.js dist/temp2.js
mv dist/*.chunk.js dist/temp3.js

formateFile() {
  inputFileName="dist/${1}"
  outputFileName="dist/${2}"
  input=${inputFileName}

  lineNumber=0

  if [[ !(-f $input) ]]; then
    addLog "Config source file '$input' does not exist."
    return
  fi

  while read line; do
    lineNumber=$((lineNumber+1))
    if [[ $lineNumber -eq 1 ]]; then
      echo "${line}" >> "${outputFileName}"
    elif [[ $lineNumber -eq 2 ]]; then
      echo "${line}" >> "${outputFileName}"
    else
      echo "Invalid line number: ${lineNumber}"
    fi
  done < "$input"
}

srcFiles=()
distFiles=()
srcFiles+=("temp1.js")
srcFiles+=("temp2.js")
srcFiles+=("temp3.js")

distFiles+=("script1.js")
distFiles+=("script2.js")
distFiles+=("script3.js")


for (( i=0; i<${#srcFiles[*]}; i++ )); do
  echo ${srcFiles[$i]} ${distFiles[$i]}
  formateFile ${srcFiles[$i]} ${distFiles[$i]}
done

echo [INFO] Copy file complete
