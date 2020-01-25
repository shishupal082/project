#!/bin/sh
configFilePath=/custom/cmd-config.txt
dir=$(sed -n "3p" $configFilePath)
fileName="pointPossibleValues.json"
tab="    "
swModel=()
swModel+=("U1")
swModel+=("U2")

PORTS=()

getInOutOptions () {
    U1=(1 2 3 4 5 6 7 8 9 10)
    U1+=(11 12 13 14 15 16 17 18 19 20)
    U1+=(21 22 23 24 25 26 27 28 29 30)
    U1=(12 25 26)
    U2=(1 2 3 4 5 6 7 8 9 10)
    U2+=(11 12 13 14 15 16 17 18 19 20)
    U2+=(21 22 23 24 25 26 27 28 29 30)
    U2=(13 14 19 25 26)
    U3=()
    if [[ $1 == "U1" ]]; then
        PORTS=${U1}
    elif [[ $1 == "U2" ]]; then
        PORTS=${U2}
    else
        PORTS=()
    fi
}

echo "Start Time:  "$(date +"%Y-%m-%d %T")
if [[ -d "${dir}" ]]; then
    if [[ -f "${dir}${fileName}" ]]; then
        rm "${dir}${fileName}"
    fi
fi

echo "[" >> "${dir}${fileName}"
swModelCount=${#swModel[*]}

# 
# echo "${tab}[" >> "${dir}${fileName}"
for (( i = 0; i <${swModelCount} ; i++ )); do
    id=${swModel[$i]}
    getInOutOptions ${id}
    ports=$PORTS
    for (( j = 0; j < ${#ports[*]}; j++ )); do
        in=${ports[$j]}
        for (( k = 0; k < ${#ports[*]}; k++ )); do
            out=${ports[$k]}
            echo "${tab}"'"'${id}-${in}-${out}'-CWKR",' >> "${dir}${fileName}"
            echo "${tab}"'"'${id}-${in}-${out}'-OWKR",' >> "${dir}${fileName}"
            echo "${tab}"'"'${id}-${in}-${out}'-WCKR",' >> "${dir}${fileName}"
            echo "${tab}"'"'${id}-${in}-${out}'-WOKR",' >> "${dir}${fileName}"
            echo "${tab}"'"'${id}-${in}-${out}'-CWLR",' >> "${dir}${fileName}"
            echo "${tab}"'"'${id}-${in}-${out}'-OWLR",' >> "${dir}${fileName}"
            echo "${tab}"'"'${id}-${in}-${out}'-CLR",' >> "${dir}${fileName}"
            echo "${tab}"'"'${id}-${in}-${out}'-OLR",' >> "${dir}${fileName}"
            echo "${tab}"'"'${id}-${in}-${out}'-CCR",' >> "${dir}${fileName}"
            echo "${tab}"'"'${id}-${in}-${out}'-OCR",' >> "${dir}${fileName}"
            echo "${tab}"'"'${id}-${in}-${out}'-ASWR",' >> "${dir}${fileName}"
            echo "${tab}"'"'${id}-${in}-${out}'-WNR",' >> "${dir}${fileName}"
        done
    done
done
# echo "${tab}]," >> "${dir}${fileName}"
# 
# echo "${tab}[" >> "${dir}${fileName}"
for (( i = 0; i < ${swModelCount}; i++ )); do
    id=${swModel[$i]}
    for (( j = 1; j <= 32; j++ )); do
        echo "${tab}"'"'${id}-"I"-${j}'",' >> "${dir}${fileName}"
        if [[ ${id} == "U2" && ${j} -eq 32 ]]; then
            echo "${tab}"'"'${id}-"O"-${j}'"' >> "${dir}${fileName}"
        else
            echo "${tab}"'"'${id}-"O"-${j}'",' >> "${dir}${fileName}"
        fi
    done
done
# echo "${tab}]" >> "${dir}${fileName}"
# 
echo "]" >> "${dir}${fileName}"
echo "End Time:${tab}"$(date +"%Y-%m-%d %T")
