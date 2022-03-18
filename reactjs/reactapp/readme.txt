UserData and roles used in various react-app (08.08.2021)
----------------------------------------------------------

login:
    - all app
username:
    - all app
orgUsername:
    - auth (for ga)
displayName:
    - not used any where

roles:

isLoginOtherUserEnable
    - auth
isAdminTextDisplayEnable
    - ftp
addTextAfterFileUploadDisable
    - monitoring


attendance app
***************
26.12.2021
- It will be used for monitor_app, field_report

validAppControl array defined in html page
userTeam defined in metaData (isSignalTeam, isTelecomTeam, isSAndTTeam, isAMCTeam, isSFRTeam) for add_field_report page

After compilation copy
dist-attendance-app folder to <App path>/app-data/public/src/js/dist-attendance-app
dist-attendance-app folder to <App path>/app-data-v4/public/src/js/dist-attendance-app


ftp app
********
26.12.2021
- Used only for probationer uploading and viewing data

project-tracking
*****************
26.12.2021
- It will be used for project tracking, Feedback monitoring

validAppControl array defined in html page
dynamicEnabling key defined in metaData (enablePageGroup01, enablePageGroup02, enablePageGroup03, enablePageGroup04)



monitor (Depricated on 26.12.2021)
***********************************************
validAppControl array defined in html page

rcc (05.01.2021)
***********************************************
Step-1
Write TLSR/TRSR in excel sheet and run node /nodejs/excel/script.js
It will create json from excel and save in required directory
Read those data in rcc application and generate all route data
Formate:
S/C/SH-1-A/B/F
S/C/SH-1-A/B/C/D/E (i.e. writting A-E is not allowed)

Important key in excel:
- type (signal, single_path)

auth-app (15.03.2022)
***********************************************
Login with gmail added on login screen
