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

1.0
=========
Always verify there should not be duplicate entry for taskComponent.

1.1
=========
2017-03-30
Added support for loading static files and template from outside of the project

2017-04-16
Added favicon icon

2017-04-22
Added id for taskItem and taskComponent

2017-04-24
Change data pattern for taskItems from hash map to arrayList

2017-04-26
Change data pattern for taskItems :
added options (Map<String, String>)
removed name, place

2017-05-01
Change data formate for taskApplication
