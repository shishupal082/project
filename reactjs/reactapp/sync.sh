#!/usr/bin/env bash
echo [INFO] Copying dependent file to desired location

cp ../../static/libs/bootstrap-react-v3.1.1.css ./src/libs/
cp ../../static/js/stack.js ./src/libs/
cp ../../app/yard1/static/css/style.css ./src/yard-s17/css/

echo [INFO] Copy file complete
