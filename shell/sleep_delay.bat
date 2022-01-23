#!/bin/sh
sleepDelay() {
  echo $1
  sleep 20
}
now=$(date +"%Y-%m-%d %T")
echo $now
sleepDelay "Testing sleep delay for 20 sec"
now=$(date +"%Y-%m-%d %T")
echo $now
sleep 5
