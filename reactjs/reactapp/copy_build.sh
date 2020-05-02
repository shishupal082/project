#!/usr/bin/env bash

echo [INFO] Copying file to desired location

rm -rf dist/*

cp build/static/js/*.js dist/

mv dist/runtime-main.*.js dist/script1.js
mv dist/main.*.chunk.js dist/script2.js
mv dist/*.chunk.js dist/script3.js

sed -i  ''  '2s/.*//' dist/script1.js
sed -i  ''  '2s/.*//' dist/script2.js
sed -i  ''  '3s/.*//' dist/script3.js

echo [INFO] Copy file complete
