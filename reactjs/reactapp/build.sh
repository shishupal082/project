#!/usr/bin/env bash

sh sync.sh

echo *****Start building application*****
echo [INFO] $(date +"%Y-%m-%d %T")

npm run build

echo [INFO] $(date +"%Y-%m-%d %T")
echo *****Build complete*****

sh copy_build.sh
