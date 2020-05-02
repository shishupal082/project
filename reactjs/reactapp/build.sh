#!/usr/bin/env bash

sh sync.sh

echo *****Start building application*****

npm run build

echo *****Build complete*****

sh copy_build.sh
