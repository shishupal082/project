#!/bin/sh
configFilePath=/custom/cmd-config.txt
dir=$(sed -n "3p" $configFilePath)json/
fileName="pointPossibleValues.json"
ignoreRecheckPossibleValuesFileName="ignoreRecheckPossibleValues.json"
expressionFileName="pointExpression.json"
# partialExpressionFileName="partialPointExpression.json"
currentValuesFileName="currentValues.json"
tab="    "

u1InPorts=(1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32)
u1OutPorts=(1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32)

u2InPorts=(1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32)
u2OutPorts=(1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32)

u1InPorts=(12)
u1OutPorts=(25 26)

u2InPorts=(19 25 26)
u2OutPorts=(13 14 25 26)

pointCount1="`expr ${#u1InPorts[*]} \* ${#u1OutPorts[*]}`"
pointCount2="`expr ${#u2InPorts[*]} \* ${#u2OutPorts[*]}`"
echo "Total points: `expr ${pointCount1} + ${pointCount2}`"

echo "Start Time:  "$(date +"%Y-%m-%d %T")


if [[ -d "${dir}" ]]; then
    if [[ -f "${dir}${fileName}" ]]; then
        rm "${dir}${fileName}"
    fi
    if [[ -f "${dir}${expressionFileName}" ]]; then
        rm "${dir}${expressionFileName}"
    fi
    # if [[ -f "${dir}${partialExpressionFileName}" ]]; then
    #     rm "${dir}${partialExpressionFileName}"
    # fi
    if [[ -f "${dir}${currentValuesFileName}" ]]; then
        rm "${dir}${currentValuesFileName}"
    fi
    if [[ -f "${dir}${ignoreRecheckPossibleValuesFileName}" ]]; then
        rm "${dir}${ignoreRecheckPossibleValuesFileName}"
    fi
fi

echo "[" >> "${dir}${fileName}"
echo "[" >> "${dir}${ignoreRecheckPossibleValuesFileName}"
echo "{" >> "${dir}${expressionFileName}"
# echo "{" >> "${dir}${partialExpressionFileName}"
echo "{" >> "${dir}${currentValuesFileName}"

addExpressionInFile() {
    id=$1
    in=$2
    out=$3
    isLast=$4
    pName=${id}-${in}-${out}
    wckrExp="(${pName}-OCR:dn&&${pName}-WOKR:dn)"
    wokrExp="(${pName}-CCR:dn&&${pName}-WCKR:dn)"
    aswrExp="((${pName}-CLR:up&&(${pName}-CWLR:up&&${pName}-CCR:dn))||((${pName}-OLR:up&&${pName}-OWLR:up)&&${pName}-OCR:dn))"
    cwkrExp="((${pName}-WCKR:up&&((${pName}-CWLR:dn&&${pName}-OWLR:dn)||${pName}-CCR:up))&&${pName}-OWKR:dn)"
    owkrExp="((${pName}-WOKR:up&&${pName}-CWKR:dn)&&((${pName}-CWLR:dn&&${pName}-OWLR:dn)||${pName}-OCR:up))"
    ccrExp="(((${pName}-WNR:up&&CWWNR:up)||(${pName}-ASWR:up||${pName}-CCR:up))&&((${pName}-OWLR:dn&&${pName}-OCR:dn)&&(${pName}-CWLR:up||${pName}-CCR:up)))"
    ocrExp="(((${pName}-WNR:up&&OWWNR:up)||(${pName}-ASWR:up||${pName}-OCR:up))&&((${pName}-CWLR:dn&&${pName}-CCR:dn)&&(${pName}-OWLR:up||${pName}-OCR:up)))"
    cwlrExp="(${pName}-WFR:up&&((((${pName}-CLR:dn&&${pName}-OLR:dn)&&((${pName}-WNR:up&&CWWNR:up)||${pName}-CWLR:up))||(${pName}-WNR:dn&&${pName}-CLR:up))&&(${pName}-CWKR:dn&&${pName}-OWLR:dn)))"
    owlrExp="(${pName}-WFR:up&&((((${pName}-CLR:dn&&${pName}-OLR:dn)&&((${pName}-WNR:up&&OWWNR:up)||${pName}-OWLR:up))||(${pName}-WNR:dn&&${pName}-OLR:up))&&(${pName}-OWKR:dn&&${pName}-CWLR:dn)))"
    # partialCLRExp="(${pName}-CWKR:dn&&${pName}-OLR:dn)"
    # partialOLRExp="(${pName}-OWKR:dn&&${pName}-CLR:dn)"
    # wfrExp=${pName}-CWWNR:dn #Temprory
    echo "${tab}"'"'${pName}'-CWKR":["'$cwkrExp'"],' >> "${dir}${expressionFileName}"
    echo "${tab}"'"'${pName}'-OWKR":["'$owkrExp'"],' >> "${dir}${expressionFileName}"
    echo "${tab}"'"'${pName}'-CCR":["'$ccrExp'"],' >> "${dir}${expressionFileName}"
    echo "${tab}"'"'${pName}'-OCR":["'$ocrExp'"],' >> "${dir}${expressionFileName}"
    echo "${tab}"'"'${pName}'-CWLR":["'$cwlrExp'"],' >> "${dir}${expressionFileName}"
    echo "${tab}"'"'${pName}'-OWLR":["'$owlrExp'"],' >> "${dir}${expressionFileName}"
    echo "${tab}"'"'${pName}'-ASWR":["'$aswrExp'"],' >> "${dir}${expressionFileName}"
    echo "${tab}"'"'${pName}'-WCKR":["'$wckrExp'"],' >> "${dir}${expressionFileName}"
    # echo "${tab}"'"'${pName}'-WFR":["'$wfrExp'"],' >> "${dir}${expressionFileName}"

    # echo "${tab}"'"'${pName}'-CLR":["'$partialCLRExp'"],' >> "${dir}${partialExpressionFileName}"
    echo "${tab}"'"'${pName}'-WFR":1,' >> "${dir}${currentValuesFileName}"
    echo "${tab}"'"'${pName}'-OWKR":1,' >> "${dir}${currentValuesFileName}"
    if [[ $isLast == true ]]; then
        echo "${tab}"'"'${pName}'-WOKR":["'$wokrExp'"]' >> "${dir}${expressionFileName}"
        # echo "${tab}"'"'${pName}'-OLR":["'$partialOLRExp'"]' >> "${dir}${partialExpressionFileName}"
        echo "${tab}"'"'${pName}'-WOKR":1' >> "${dir}${currentValuesFileName}"
    else
        echo "${tab}"'"'${pName}'-WOKR":["'$wokrExp'"],' >> "${dir}${expressionFileName}"
        # echo "${tab}"'"'${pName}'-OLR":["'$partialOLRExp'"],' >> "${dir}${partialExpressionFileName}"
        echo "${tab}"'"'${pName}'-WOKR":1,' >> "${dir}${currentValuesFileName}"
    fi
}
addPossibleValueInFile() {
    id=$1
    in=$2
    out=$3
    re='^[0-9]+$'
    # Partial possible values for point is => U1-I-12
    if ! [[ $in =~ $re ]] ; then
       echo "${tab}"'"'${id}-${in}-${out}'",' >> "${dir}${fileName}"
       echo "${tab}"'"'${id}-${in}-${out}'",' >> "${dir}${ignoreRecheckPossibleValuesFileName}"
    else
        echo "${tab}"'"'${id}-${in}-${out}'-OWKR",' >> "${dir}${fileName}"
        echo "${tab}"'"'${id}-${in}-${out}'-CWKR",' >> "${dir}${fileName}"
        echo "${tab}"'"'${id}-${in}-${out}'-WOKR",' >> "${dir}${fileName}"
        echo "${tab}"'"'${id}-${in}-${out}'-WCKR",' >> "${dir}${fileName}"
        echo "${tab}"'"'${id}-${in}-${out}'-CWLR",' >> "${dir}${fileName}"
        echo "${tab}"'"'${id}-${in}-${out}'-OWLR",' >> "${dir}${fileName}"
        echo "${tab}"'"'${id}-${in}-${out}'-CLR",' >> "${dir}${fileName}"
        echo "${tab}"'"'${id}-${in}-${out}'-OLR",' >> "${dir}${fileName}"
        echo "${tab}"'"'${id}-${in}-${out}'-CCR",' >> "${dir}${fileName}"
        echo "${tab}"'"'${id}-${in}-${out}'-OCR",' >> "${dir}${fileName}"
        echo "${tab}"'"'${id}-${in}-${out}'-ASWR",' >> "${dir}${fileName}"
        echo "${tab}"'"'${id}-${in}-${out}'-WFR",' >> "${dir}${fileName}"
        echo "${tab}"'"'${id}-${in}-${out}'-WNR",' >> "${dir}${fileName}"
        echo "${tab}"'"'${id}-${in}-${out}'-WNR",' >> "${dir}${ignoreRecheckPossibleValuesFileName}"
        echo "${tab}"'"'${id}-${in}-${out}'-OLR",' >> "${dir}${ignoreRecheckPossibleValuesFileName}"
    fi
}
addDisplayExpressionInFile() {
    pName=$1
    exp=$2
    echo "${tab}"'"'${pName}'":["'$exp'"],' >> "${dir}${expressionFileName}"
}
# U1 starts ************
# U1 I/O ports
id=U1
for (( j = 0; j < ${#u1InPorts[*]}; j++ )); do
    for (( k = 0; k < ${#u1OutPorts[*]}; k++ )); do
        addPossibleValueInFile $id ${u1InPorts[$j]} ${u1OutPorts[$k]}
        addExpressionInFile $id ${u1InPorts[$j]} ${u1OutPorts[$k]}
    done
done
# U1 I ports
for (( j = 0; j < ${#u1InPorts[*]}; j++ )); do
    addPossibleValueInFile $id I ${u1InPorts[$j]}
    exp=""
    for (( k = 0; k < ${#u1OutPorts[*]}; k++ )); do
        if [[ $exp == "" ]]; then
            exp="${id}-${u1InPorts[$j]}-${u1OutPorts[$k]}-CWKR:up"
        else
            exp="(${exp}||${id}-${u1InPorts[$j]}-${u1OutPorts[$k]}-CWKR:up)"
        fi
    done
    addDisplayExpressionInFile $id-I-${u1InPorts[$j]} ${exp}
    # echo  $id-I-${u1InPorts[$j]} ${exp}
done
# U1 O ports
for (( j = 0; j < ${#u1OutPorts[*]}; j++ )); do
    addPossibleValueInFile $id O ${u1OutPorts[$j]}
    exp=""
    for (( k = 0; k < ${#u1InPorts[*]}; k++ )); do
        if [[ $exp == "" ]]; then
            exp="${id}-${u1InPorts[$k]}-${u1OutPorts[$j]}-CWKR:up"
        else
            exp="(${exp}||${id}-${u1InPorts[$k]}-${u1OutPorts[$j]}-CWKR:up)"
        fi
    done
    addDisplayExpressionInFile $id-O-${u1OutPorts[$j]} ${exp}
    # echo $id-O-${u1OutPorts[$j]} ${exp}
done
# U1 ends ************
# ----------------------------------------------------------------------
# U2 starts ************
id=U2
# U2 I ports
for (( j = 0; j < ${#u2InPorts[*]}; j++ )); do
    addPossibleValueInFile $id I ${u2InPorts[$j]}
    exp=""
    for (( k = 0; k < ${#u2OutPorts[*]}; k++ )); do
        if [[ $exp == "" ]]; then
            exp="${id}-${u2InPorts[$j]}-${u2OutPorts[$k]}-CWKR:up"
        else
            exp="(${exp}||${id}-${u2InPorts[$j]}-${u2OutPorts[$k]}-CWKR:up)"
        fi
    done
    addDisplayExpressionInFile $id-I-${u2InPorts[$j]} ${exp}
    # echo  $id-I-${u2InPorts[$j]} ${exp}
done
# U2 O ports
for (( j = 0; j < ${#u2OutPorts[*]}; j++ )); do
    addPossibleValueInFile $id O ${u2OutPorts[$j]}
    exp=""
    for (( k = 0; k < ${#u2InPorts[*]}; k++ )); do
        if [[ $exp == "" ]]; then
            exp="${id}-${u2InPorts[$k]}-${u2OutPorts[$j]}-CWKR:up"
        else
            exp="(${exp}||${id}-${u2InPorts[$k]}-${u2OutPorts[$j]}-CWKR:up)"
        fi
    done
    addDisplayExpressionInFile $id-O-${u2OutPorts[$j]} ${exp}
    # echo $id-O-${u2OutPorts[$j]} ${exp}
done
# U2 I/O ports
for (( j = 0; j < ${#u2InPorts[*]}; j++ )); do
    for (( k = 0; k < ${#u2OutPorts[*]}; k++ )); do
        addPossibleValueInFile $id ${u2InPorts[$j]} ${u2OutPorts[$k]}
        if [[ $j -eq ${#u2InPorts[*]}-1 && $k -eq ${#u2OutPorts[*]}-1 ]]; then
            addExpressionInFile $id ${u2InPorts[$j]} ${u2OutPorts[$k]} true
        else
            addExpressionInFile $id ${u2InPorts[$j]} ${u2OutPorts[$k]}
        fi
    done
done
echo "${tab}"'"CWWNR",' >> "${dir}${ignoreRecheckPossibleValuesFileName}"
echo "${tab}"'"OWWNR"' >> "${dir}${ignoreRecheckPossibleValuesFileName}"
echo "${tab}"'"CWWNR",' >> "${dir}${fileName}"
echo "${tab}"'"OWWNR"' >> "${dir}${fileName}"
# U2 ends ************
# ----------------------------------------------------------------------
echo "}" >> "${dir}${expressionFileName}"
echo "}" >> "${dir}${currentValuesFileName}"
# echo "}" >> "${dir}${partialExpressionFileName}"
echo "]" >> "${dir}${ignoreRecheckPossibleValuesFileName}"
echo "]" >> "${dir}${fileName}"
echo "End Time:${tab}"$(date +"%Y-%m-%d %T")
