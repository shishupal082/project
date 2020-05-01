#!/usr/bin/env bash

echo *****Start building application*****

npm run build

echo *****Build complete*****

sh copy_build.sh
