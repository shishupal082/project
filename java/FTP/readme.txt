Readme file for ftp-application
-----------------------------------------
To run application
--------------------------
1) On Windows
    - Double click on run.bat
2) On Linux
    - sh run.bat

Then open below url in browser (Preferably Chrome)
==> http://127.0.0.1:8080

If ask login (Available users are as below)

U1,U1,U1 User (Username: U1, Password U1)
U2,U1,U2 User (Username: U2, Password U1)
U3,U1,U3 User (Username: U3, Password U1)
Admin,Admin,Admin User (Username: Admin, Password Admin)

****************
Pre requisite
------------------
System should have installed java version-1.7 or above

*****************
If not working
-------------------
Go to current directory in cmd
for directory change type
- D:
Then follow cd command to enter into that folder
Then type
- run.bat

It will give reason for not running application

******************************
Change config if required
------------------------------------
- logFilePath (string) (D:/workspace/project/ftp-app/log/application.log)
    - used for copy and delete old file
- supportedFileType (arrayList) (pdf,jpeg,jpg,png)
- maxFileSize(Integer) (10MB)
- fileSaveDir (string)
    - Example:
        fileSaveDir: D:/workspace/project/ftp-app/saved-files/
    - Default file save directory will be running directory + "/saved-files/"
- adminUsersName (arrayList) (Admin)
- filenameFormat (string)
    - username, filename, YYYY-MM-dd, HH-mm-ss-SSS
    for example
        - "YYYY-MM-dd'-username'"
        - "YYYY-MM-dd'-filename'"
        - "YYYY-MM-dd'-username-filename'"
        - "YYYY-MM-dd-HH-mm-ss-SSS"
