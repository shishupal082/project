#!/usr/bin/env bash

echo [INFO] Copying dependent file to desired location

sed -i  ''  "1s/.*/import $\\S from '.\\/stack';/" ./src/libs/model.js
sed -i  ''  "1s/.*/import '.\\/model'; var $\\M = window.$\\M;/" ./src/libs/yardApiModel.js

echo [INFO] Copy file complete
