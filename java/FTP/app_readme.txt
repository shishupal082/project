/view/file?name=filename

filename shall always be /username/filename.pdf (i.e. length = 2)

filename saving pattern added in env config (can be added username or filename)
filenameFormat: "YYYY-MM-dd'-username-filename'"

configFile change (made optional)
----------------------------------
createReadmePdf: true
indexPageReRoute: /dashboard
appViewFtlFileName: app_view.ftl
publicDir: "../.."
publicPostDir:
allowedOrigin:
  - http://localhost
  - http://localhost:9000
  - http://localhost:8080
tempConfig:
  userName: U1


Why app_static_data.json is in file-saved directory ?
-------------------------------------------------------
- Because public directory is not fixed it may be null or any other folder
- If public folder is set as some other location then meta data path may not available
- meta-data is copied from java build app
- One is sure, file-saved directory is always available, because it also contains user data
