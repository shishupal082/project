#!/bin/sh
firstArg=$1
marker=**********
logFile=cmdlog.txt
INPUT_FILE=""
CONFIG_SRC=copy/config.txt
# key is 5 digit random number called session id
key=$(($RANDOM%99999+10000))
isLogFileFound=false
removeOldFileFolder=false
FILEFOLDERSIZE=0k
directoryRequiredConfigFile=false


addLog() {
  now=$(date +"%Y-%m-%d %T")
  if [[ $isLogFileFound == true ]]; then
    echo "${now} $1"
    echo "${now} $key $1" >> $logFile
  else
    # * represent log file is not found
    echo "${now}* $1"
  fi
}

ParsedFileLine=""

parseFileLine () {
  ParsedFileLine=""
  foo=$1
  for (( i=0; i<${#foo}-1; i++ )); do
    ParsedFileLine=${ParsedFileLine}${foo:$i:1}
  done
}
parseFileLineV2 () {
  ParsedFileLine=""
  foo=$1
  for (( i=0; i<${#foo}; i++ )); do
    ParsedFileLine=${ParsedFileLine}${foo:$i:1}
  done
}

verifyLogFile () {
  now=$(date +"%Y-%m-%d %T")
  if [ -f "$1" ]; then
    logFile=$1
    isLogFileFound=true
  elif [[ $isLogFileFound == true ]]; then
    addLog "new logFile '${1}' does not exist, continue with old logFile '${logFile}'"
  else
    isLogFileFound=false
    echo "${now}* logFile '${logFile}' does not exist."
  fi  
}

verifyLogFile $logFile

readConfig() {
  input=${CONFIG_SRC}
  lineNumber=0

  if [[ !(-f $input) ]]; then
    addLog "Config source file '$input' does not exist."
    return
  fi

  while read line; do
    lineNumber=$((lineNumber+1))
    parseFileLineV2 ${line}
    line2=${ParsedFileLine}
    if [[ $lineNumber -eq 1 ]]; then
      line2=${line2}
      verifyLogFile ${line2}
    elif [[ $lineNumber -eq 2 ]]; then
      INPUT_FILE=${line2}
    elif [[ $lineNumber -eq 3 ]]; then
      IFS='=' #setting = as delimiter
      read -a strarr <<<"$line2" #reading str as an array as tokens separated by IFS
      removeOldFileFolder=${strarr[1]}
    elif [[ $lineNumber -eq 4 ]]; then
      directoryRequiredConfigFile=${line2}
    fi
  done < "$input"
}

readConfig

addLog "${marker} Copy start ${marker}"
addLog "Current directory: $(pwd)"

readDirectoryRequiredConfig() {
  lineNumber=0

  if [[ !(-f $directoryRequiredConfigFile) ]]; then
    return
  fi

  while read line; do
    parseFileLineV2 ${line}
    line2=${ParsedFileLine}
    if [[ !(-d ${line2}) ]]; then
      addLog "Required directory '$line2' does not exist, created"
      mkdir ${line2}
    fi
  done < "$directoryRequiredConfigFile"
}
readDirectoryRequiredConfig

setFILEFOLDERSIZE () {
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
  input=${INPUT_FILE}
  lineNumber2=0
  lineBlock=0
  lineBlockData=()

  if [[ !(-f $input) ]]; then
    addLog "Input source file '$input' does not exist."
    return
  fi

  while read line; do
    lineNumber2=$((lineNumber2+1))
    lineNumber3=`expr $lineNumber2 / 3`
    # Not required for MacBook but required for windows
    # line2=$(echo $line | tr ' ' '\n')
    parseFileLine ${line}
    line2=${ParsedFileLine}
    if [[ $line2 == "" ]]; then
      line2=zzzzzzzzzz
    fi
    lineBlockData+=($line2)
    if [[ $lineNumber3 != $lineBlock ]]; then
      destinationDir+=(${lineBlockData[0]})
      name+=(${lineBlockData[1]})
      sourceDir+=(${lineBlockData[2]})
      lineBlockData=()
      lineBlock=$((lineBlock+1))
    fi
  done < "$input"
}

updateSource

checkCopyCommand() {
  loopEndCount=$((${#destinationDir[*]}))
  addLog "Number of copy required : ${loopEndCount}"
  for ((c=0; c<$loopEndCount; c++))
  do
    s=${sourceDir[$c]}
    d=${destinationDir[$c]}
    f=${name[$c]}
    if [[ ${sourceDir[$c]} == "zzzzzzzzzz" ]]; then
      s=""
    fi
    if [[ ${destinationDir[$c]} == "zzzzzzzzzz" ]]; then
      d=""
    fi
    if [[ ${name[$c]} == "zzzzzzzzzz" ]]; then
      f=""
    fi
    addLog "cp -r $s$f $d"
  done
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
  if [[ $removeOldFileFolder == true ]]; then
    if [[ -d "${destination}" ]]; then
      addLog "rm -rf ${destination}"
      rm -rf ${destination}
    elif [[ -f "${destination}" ]]; then
      addLog "rm ${destination}"
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
  IFS=$'\t'
  tmp=($FILEFOLDERSIZE)
  FILEFOLDERSIZE=${tmp[0]}
  # i=0
  # for index in $(echo $FILEFOLDERSIZE | tr "" " ")
  # do
  #   if [[ $i > 0 ]]; then
  #     continue
  #   fi
  #   FILEFOLDERSIZE=$index
  #   i="`expr $i + 1`"
  # done
}

copyData() {
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
      addLog "Copying size ${FILEFOLDERSIZE} from '${s}${f}' to '${d}'"
      cp -r ${s}${f} ${d}
    else
      addLog "Destination directory '${d}' does not exist."
    fi
  done
}

handleRequestParameter() {

  case $1 in
  checkCopyCommand)
    checkCopyCommand
    ;;
  check)
    checkCopyCommand
    ;;
  copyData)
    copyData
    break
    ;;
  removeOld)
    # removeOldFileFolder=true
    copyData
    break
    ;;
  help)
    addLog "sh filename"
    addLog "sh filename help"
    addLog "sh filename check"
    addLog "sh filename checkCopyCommand"
    addLog "sh filename copyData"
    # addLog "sh filename removeOld"
    ;;
  *)
    echo "Invalid argument"
    ;;
  esac
}


if [ "$1" != "" ]; then
    handleRequestParameter $1
else
    handleRequestParameter "copyData"
fi


addLog "${marker} COPY END ${marker}"

# read -p "Press enter to exit."