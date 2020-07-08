Version=1.0.1 (2020/04/29)
--------------------------
env_config parameters
*****************************************
allowedOrigin:
  - http://localhost:3000
  - http://localhost:9000
  - http://localhost
indexPageReRoute: /app
icoFilePath: meta-data/favicon.ico
publicDir: ../
publicPostDir: /static/
directoryConfig:
  mimeType:
    png: image/png
    jpg: image/jpg
    jpeg: image/jpeg
    gif: image/gif
    ico: image/x-icon
    css: text/css
    js: text/javascript
    html: text/html
    htm: text/html
    htmls: text/html
    pdf: application/pdf
    json: application/json
    yaml: text/plain
    yml: text/plain
    csv: text/plain
    txt: text/plain
    sh: text/sh
*****************************************
env_config parameters end

allowedOrigin config parameter added
If not found, all origin will be allowed

publicDir
---------
publicDir will be split on "/" then it will count number of ".."
    then systemDir will be split on "/" and those many counts of systemDir will be replace by "" from end
    then it will be join with "/", if first item of systemDir will be "" then it will be replace by "/"
    finally last "/" will be replace with ""
    Note: Here, there is no chance of "//" at anywhere during above operation

publicPostDir
-------------
It will be simply add to publicDir generated above
Therefore, As publicDir does not have "/" in the end,
    So publicPostDir should start from "/" for pointing inside working directory
    and ".." for pointing outside working directory

