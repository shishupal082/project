#!/bin/sh
marker=**********

logFile=logs/log.txt
key=$(($RANDOM%99999+10000))
isLogFileFound=false


FILEFOLDERSIZE=0k


verifyLogFile () {
  if [ -f "$1" ]; then
    isLogFileFound=true
  else
    isLogFileFound=false
    now=$(date +"%Y-%m-%d %T")
    echo "${now}* logFile '${logFile}' does not exist."
  fi  
}

verifyLogFile $logFile

addLog() {
  now=$(date +"%Y-%m-%d %T")
  if [[ $isLogFileFound == true ]]; then
    echo "${now} $1"
    echo "${now} $key $1" >> $logFile
  else
    echo "${now}* $1"                     # * represent log file is not found
  fi
}

verifyOldData() {
  if [[ $1 = "zzzzzzzzzz" ]]; then
    sourceDir=""
  else
    sourceDir=$1
  fi
  if [[ $2 = "zzzzzzzzzz" ]]; then
    destinationDir=""
  else
    destinationDir=$2
  fi
  if [[ $3 = "zzzzzzzzzz" ]]; then
    fileFolderName=""
  else
    fileFolderName=$3
  fi
  destination=${destinationDir}${fileFolderName}
  source=${sourceDir}${fileFolderName}
  if [[ -d "${destination}" ]]; then
    rm -rf ${destination}
  elif [[ -f "${destination}" ]]; then
    rm ${destination}
  else
    if [[ -f ${source} ]]; then
      addLog "Old File '${destination}' does not exist"
    elif [[ -d ${source}  ]]; then
      addLog "Old Folder '${destination}' does not exist"
    else
      addLog "Old File/Folder '${destination}' does not exist"
    fi
  fi
}


updateFILEFOLDERSIZE () {
  if [[ $1 = "zzzzzzzzzz" ]]; then
    s=""
  else
    s=$1
  fi
  if [[ $2 = "zzzzzzzzzz" ]]; then
    f=""
  else
    f=$2
  fi
  if [[ -d ${s}${f} ]]; then
    FILEFOLDERSIZE=$(du -sh ${s}${f})
  elif [[ -f ${s}${f} ]]; then
    FILEFOLDERSIZE=$(du -sh ${s}${f})
  fi
  i=0
  for index in $(echo $FILEFOLDERSIZE | tr "" "\n")
  do
    if [[ $i > 0 ]]; then
      continue
    fi
    FILEFOLDERSIZE=$index
    i="`expr $i + 1`"
  done
}

sourceDir=()
name=()
destinationDir=()

updateSource () {
  input="file_data.txt"
  lineNumber=0

  if [[ !(-f $input) ]]; then
    addLog "Input source file '$input' does not exist."
    return
  fi

  while read line; do
    if [[ $lineNumber < 1 ]]; then
      for word in $(echo $line | tr " " "\n"); do
        logFile=$word
        break
      done
      lineNumber=$((lineNumber+1))
      verifyLogFile $logFile
      continue
    fi
    for word in $(echo $line | tr " " "\n"); do
      lineData+=($word)
    done

    destinationDir+=(${lineData[0]})
    name+=(${lineData[1]})
    sourceDir+=(${lineData[2]})

    lineData=()
    lineNumber=$((lineNumber+1))
  done < "$input"
}


addLog "${marker} Copy start ${marker}"
addLog "Current directory: $(pwd)"

updateSource

loopEndCount=$((${#destinationDir[*]}))

for ((c=0; c<$loopEndCount; c++))
do
  s=${sourceDir[$c]}
	d=${destinationDir[$c]}
  f=${name[$c]}
  ss=${s}
  dd=${d}
  ff=${f}
  if [ -d "$d" ]; then
    if [[ $ss = "" ]]; then
      ss="zzzzzzzzzz"         # 10 times z
    fi
    if [[ $dd = "" ]]; then
      dd="zzzzzzzzzz"
    fi
    if [[ $ff = "" ]]; then
      ff="zzzzzzzzzz"
    fi
    verifyOldData ${ss} ${dd} ${ff}
    updateFILEFOLDERSIZE ${ss} ${ff}
    size=${FILEFOLDERSIZE}
    addLog "Copying from '${s}${f}' size ${size} to '${d}'"
    cp -r ${s}${f} ${d}
    # if [[ -f ${s}${f} ]]; then
      # size=$(wc -c <${s}${f})           # Get file size in bytes
      # if [[ $size -lt 1000000 ]]; then
      #   size="`expr $size / 1000`kb"
      # elif [[ $size -lt 1000000000 ]]; then
      #   size="`expr $size / 1000000`mb"
      # else
      #   size="`expr $size / 1000000000`gb"
      # fi
    #   addLog "Copying files size ${size} from '${s}${f}' to '${d}'"
    #   cp ${s}${f} ${d}
    # else
    #   addLog "Copying files size ${size} from '${s}${f}' to '${d}'"
    #   cp -r ${s}${f} ${d}
    # fi
  else
    addLog "Destination directory '${d}' does not exist."
  fi
done
addLog "${marker} COPY END ${marker}"

read -p "Press enter to exit."
