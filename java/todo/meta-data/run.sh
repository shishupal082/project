#!/usr/bin/env bash
echo *****Starting application*****
java -jar meta-data/todo-*-SNAPSHOT.jar server meta-data/env_config.yml
echo *****Application stoped*****
