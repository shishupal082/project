#!/usr/bin/env bash

echo *****Start building application*****

mvn clean install
echo *****Build complete*****

sh run.sh
