yardFile=java/yard/src/main/java/com/yard/service/TextToPdfService.java
pdfFile=java/pdf/src/main/java/com/pdf/pdfService/TextToPdfService.java

syncFiles=()

syncFiles+=(${yardFile})
syncFiles+=(${pdfFile})
syncFiles+=(java/yard/src/main/resources/assets/)

syncFiles+=(static/js/stack.js)
syncFiles+=(static/js/model.js)
syncFiles+=(static/js/yard/yardApiModel.js)

syncFiles+=(app/yard1/static/css/)

syncFiles+=(app/yard1/static/js/)
syncFiles+=(app/yard1/static/json/)

syncFiles+=(app/yard-s17/static/js/)
syncFiles+=(app/yard-s17/static/json/)


loopEndCount=$((${#syncFiles[*]}))
for ((c=0; c<$loopEndCount; c++))
  do
    f=${syncFiles[$c]}
    if [ -f "$f" ]; then
        git diff ${f}
    elif [ -d "$f" ]; then
        git diff ${f}
    else
      echo "File or Folder '${f}' does not exist."
    fi
done
