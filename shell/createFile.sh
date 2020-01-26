#!/bin/sh
configFilePath=/custom/cmd-config.txt
dir=$(sed -n "3p" $configFilePath)
fileName="pointPossibleValues.json"
tab="    "

u1InPorts=(12)
u1OutPorts=(25 26)

u2InPorts=(19 25 26)
u2OutPorts=(13 14 25 26)


echo "Start Time:  "$(date +"%Y-%m-%d %T")
if [[ -d "${dir}" ]]; then
    if [[ -f "${dir}${fileName}" ]]; then
        rm "${dir}${fileName}"
    fi
fi

echo "[" >> "${dir}${fileName}"
# swModelCount=${#swModel[*]}

addInFile() {
    id=$1
    in=$2
    out=$3
    re='^[0-9]+$'
    if ! [[ $in =~ $re ]] ; then
       echo "${tab}"'"'${id}-${in}-${out}'",' >> "${dir}${fileName}"
    else
        echo "${tab}"'"'${id}-${in}-${out}'-CWKR",' >> "${dir}${fileName}"
        echo "${tab}"'"'${id}-${in}-${out}'-OWKR",' >> "${dir}${fileName}"
        echo "${tab}"'"'${id}-${in}-${out}'-WCKR",' >> "${dir}${fileName}"
        echo "${tab}"'"'${id}-${in}-${out}'-WOKR",' >> "${dir}${fileName}"
        echo "${tab}"'"'${id}-${in}-${out}'-CWLR",' >> "${dir}${fileName}"
        echo "${tab}"'"'${id}-${in}-${out}'-OWLR",' >> "${dir}${fileName}"
        echo "${tab}"'"'${id}-${in}-${out}'-WFR",' >> "${dir}${fileName}"
        echo "${tab}"'"'${id}-${in}-${out}'-CLR",' >> "${dir}${fileName}"
        echo "${tab}"'"'${id}-${in}-${out}'-OLR",' >> "${dir}${fileName}"
        echo "${tab}"'"'${id}-${in}-${out}'-CCR",' >> "${dir}${fileName}"
        echo "${tab}"'"'${id}-${in}-${out}'-OCR",' >> "${dir}${fileName}"
        echo "${tab}"'"'${id}-${in}-${out}'-ASWR",' >> "${dir}${fileName}"
        echo "${tab}"'"'${id}-${in}-${out}'-WNR",' >> "${dir}${fileName}"
    fi
}

# U1 starts ************
# U1 I/O ports
id=U1
for (( j = 0; j < ${#u1InPorts[*]}; j++ )); do
    for (( k = 0; k < ${#u1OutPorts[*]}; k++ )); do
        addInFile $id ${u1InPorts[$j]} ${u1OutPorts[$k]}
    done
done
# U1 I ports
for (( j = 0; j < ${#u1InPorts[*]}; j++ )); do
    addInFile $id I ${u1InPorts[$j]}
done
# U1 O ports
for (( j = 0; j < ${#u1OutPorts[*]}; j++ )); do
    addInFile $id O ${u1OutPorts[$j]}
done
# U1 ends ************
# ----------------------------------------------------------------------
# U2 starts ************
# U2 I/O ports
id=U2
for (( j = 0; j < ${#u2InPorts[*]}; j++ )); do
    for (( k = 0; k < ${#u2OutPorts[*]}; k++ )); do
        addInFile $id ${u2InPorts[$j]} ${u2OutPorts[$k]}
    done
done
# U2 I ports
for (( j = 0; j < ${#u2InPorts[*]}; j++ )); do
    addInFile $id I ${u2InPorts[$j]}
done
# U2 O ports
for (( j = 0; j < ${#u2OutPorts[*]}; j++ )); do
    if [[ $j -eq ${#u2OutPorts[*]}-1 ]]; then
        echo "${tab}"'"'${id}-"O"-${u2OutPorts[$j]}'"' >> "${dir}${fileName}"
    else
        addInFile $id O ${u2OutPorts[$j]}
    fi
done
# U2 ends ************
# ----------------------------------------------------------------------
echo "]" >> "${dir}${fileName}"
echo "End Time:${tab}"$(date +"%Y-%m-%d %T")
