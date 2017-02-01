#!/usr/bin/env bash
echo *****Starting application*****
java -jar target/todo-*-SNAPSHOT.jar server meta-data/env_config.yml
echo *****Application stoped*****
