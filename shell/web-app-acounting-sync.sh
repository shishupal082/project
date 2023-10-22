#!/usr/bin/env bash
echo "***** App sync start *****"

cp -r ../../../app/account/ app/
cp -r ../../../reactjs/reactapp-2/dist-account-app/ reactjs/reactapp-2/
cp -r ../../../pvt/app-data/account/ pvt/app-data/
cp ../../../static/libs/bootstrap-v4.4.1.css static/libs/
cp ../../../static/img/icons/back-32.png static/img/icons/

rm -rf pvt/app-data/account/accountal

echo "***** App sync end *****"
