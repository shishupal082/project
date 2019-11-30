echo 
echo "Digital Clock for Linux"
echo "To stop this clock use command kill pid, see above for pid"
echo "Press a key to continue. . ."


CURPOSACT[0]=0
CURPOSACT[1]=0

displayScreen () {
    # clear
    echo -e -n "\033[7s"              # save current screen postion & attributes
    tput cup ${CURPOSACT[0]} 0        # row 0 and column 0 is used to show clock
    # printf '\r'                       # -r put cursor at the begining of the line
    # echo -ne "$pc%\033[0K\r"          # "\033[0K" will delete to the end of the line - in case your progress line gets shorter at some point
    echo -n "$(date +"%Y-%m-%d %T")"  # -n on echo will prevent the cursor advancing to the next line
    echo -e -n "\033[8u"              # restore current screen postion & attributs
}
setRowCol () {
	echo -en "\E[6n"
	read -sdR CURPOS
	string=${CURPOS#*[}
	i=0
	for index in $(echo $string | tr ";" "\n")
	do
		if [[ $i > 0 ]]; then
			continue
		fi
		if [[ "$index" =~ ^[0-9]+$ ]]; then
        	if [[ $index -gt ${CURPOSACT[$i]} ]]; then
				CURPOSACT[$i]=$index
			fi
		fi
		i="`expr $i + 1`"
	done
}
while :
do
	setRowCol
    displayScreen
    sleep .5
done