#!/usr/bin/env bash
echo *****Starting application*****
java -jar meta-data/todo-1.1-SNAPSHOT.jar server meta-data/config/env_config.yml
echo *****Application stoped*****
