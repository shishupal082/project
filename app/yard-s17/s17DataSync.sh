#!/usr/bin/env bash

echo "***** Syncing Start *****"

rm -rf ../../java/yard/src/main/resources/assets/s17/*
mkdir ../../java/yard/src/main/resources/assets/s17/css/
cp -r static/ ../../java/yard/src/main/resources/assets/s17/
cp ../yard/static/css/* ../../java/yard/src/main/resources/assets/s17/css/

echo "***** Syncing End *****"
