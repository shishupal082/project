#!/usr/bin/env bash
echo *****Starting application*****
java -jar meta-data/todo-*-SNAPSHOT.jar server meta-data/config/env_config.yml
echo *****Application stoped*****
