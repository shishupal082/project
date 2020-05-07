#!/usr/bin/env bash

echo [INFO] Copying file to desired location

distDir=index-app-dist
distDir=yard-s17-dist

rm -rf ${distDir}/*

cp build/static/js/*.js ${distDir}/

mv ${distDir}/runtime-main.*.js ${distDir}/script1.js
mv ${distDir}/main.*.chunk.js ${distDir}/script2.js
mv ${distDir}/*.chunk.js ${distDir}/script3.js

sed -i  ''  '2s/.*//' ${distDir}/script1.js
sed -i  ''  '2s/.*//' ${distDir}/script2.js
sed -i  ''  '3s/.*//' ${distDir}/script3.js

echo [INFO] Copy file complete
