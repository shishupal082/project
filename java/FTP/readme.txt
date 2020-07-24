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

U1,U1,U1 User (Username: U1, Password: U1)
U2,U1,U2 User (Username: U2, Password: U1)
U3,U1,U3 User (Username: U3, Password: U1)
public,public,Public User (Username: public, Password: public)
Admin,Admin,Admin User (Username: Admin, Password: Admin)

----------------------------------------------------------
For user registration (passcode will be required)
Below format can be added in user_data.csv file

U1,,U1 User,1234 (passcode=1234 can be used only once)
    - 1) username = U1
    - 2) password = "" (it will be set after registration)
    - 3) user display name = U1 User
    - 4) passcode = 1234

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
- permanentlyDeleteFile: false (Boolean)
    - If true, file will be permanently deleted
    - If false, file will be move to trash folder
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

Fixed configurations
---------------------
SESSION_TTL = 10min
MAX_ENTRY_ALLOWED_IN_USER_DATA_FILE = 8
