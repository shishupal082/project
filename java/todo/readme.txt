To run this application

Go to todo folder then =>

run the command => sh run.sh

or,

java -jar meta-data/todo-*-SNAPSHOT.jar server meta-data/config/env_config.yml

==================================================================================
Start working on ui part :
==================================================================================
go to ui folder :
npm install
if gulp is not installed => sudo npm install --global gulp
In one terminal => gulp webserver
In other terminal => gulp watch


Steps to setup
==================================================================================
Import project in "IntelliJ IDEA"
Add pom.xml in project by right click
Edit configuration

Name : TodoApplication
Main class : com.todo.TodoApplication
Program arguments : server env_config_path

1.1
=========
2017-04-16
Added favicon icon

2017-03-30
Added support for loading static files and template from outside of the project