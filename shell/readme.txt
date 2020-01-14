Readme for shell commands

2020-01-14
----------
copy_command_v2.0.sh and file_data_v2.0.txt added

extra copy folded added to have better config management

copy_command_v2.0.sh required to set CONFIG_SRC as copy/config.txt

copy/config.txt
	- 1st line as log file
	- 2nd line as copy configuration

In copy configuration

It takes for each copy 3 line

1st line: destination folder
2nd line: source file or folder
3rd line: source folder

source folder can be empty also

One extra line at the end

Ex: To copy 4 file or folder we required 13 line
1 to 12 => (12) info about copy command
13 => (1) extra line
