2020-07-21
----------------
To run application
1) On Windows
    - Double click on run.bat
2) On Linux
    - sh run.bat

Then open below url in browser (Preferably Chrome)
==> http://127.0.0.1:8080

Pre requisite
------------------
System should have installed java version-1.7 or above

If not working
-------------------
Go to current directory in cmd
for directory change type
- D:
then follow cd command to enter into that folder
Then type
- run.bat

It will give reason for not running application

Change config if required
------------------------------------
- supportedFileType (pdf)
- maxFileSize (2MB)
- fileSaveDir
    - Default file save directory will be running directory + "/saved-files/"
- adminUsersName (Admin)
- filenameFormat
    - username, filename, YYYY-MM-dd, HH-mm-ss-SSS
    for example
        - "YYYY-MM-dd'-username'"
        - "YYYY-MM-dd'-filename'"
        - "YYYY-MM-dd'-username-filename'"
        - "YYYY-MM-dd-HH-mm-ss-SSS"
