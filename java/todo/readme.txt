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

2017-05-05

Data/view api
Return if file exist

/files/v1/get/data/test.txt?name={file-name}

Data/view api
Return list of files if this type exist
/files/v1/filter/data?type=txt,csv

Data/view api
Return list of files by searching recursive
/files/v2/getAll/view

Data/view api
Return list of files by searching recursive based on index
/files/v2/getAll/index/{id}/data

Data/view api
Return list of files by searching ir-recursive
/files/v3/getAll/view

Data/view api
Return list of files by searching ir-recursive based on index
/files/v3/getAll/index/{id}/data


1.2
=========
2017-05-08
==============
Added history config file

2017-05-10
==============
Added standard value for component id under task items

2017-05-12
==============
Unique check added for taskId
pathReplaceString, unsupportedFileType, mimeType config moved from directory config to enc config


2017-05-16
==============
Added /task/api/v2/tasks api
made similar api for all task or app v1 or w.r.t. by id v1 or v2

2017-05-18
==============
Combine external directory file and config task config file and made as app_config
Move get and update file config to config resources for tasks and files

2017-05-19
==============
Bug fix for get task api by id, not reflecting updated data

1.3
=========
2017-06-05
==============
Response changed for
/api/v2/tasks
/api/v2/tasks/{taskId}

old :
{
  componentDetails[]: {name: string, aplication[][]: string},
  taskDetails : {
    id: string
	component: string[]
	options: {string: string}
  }
}

new :
{
  componentDetails[]: {name: string, aplication[][]: string},
  id: string
  component: string[]
  options: {string: string}
}

Create new api which give task by id + history of that id
Hystory is added parallel to id, options, .. in data file
history:
  - date: YYYY-MM-DD-HH:MM
    field_1: string
  - date: YYYY-MM-DD-HH:MM
    field_1: string
    str_1: str_2

New Api Added
1] /api/v3/tasks (Add history data in v3)
2] /api/v3/tasks/{taskId} (Add history data in v2)
3] /api/v3/app/all (Add history data in v2)
4] /api/v3/app/id/{appId} (Add history data in v2)

Pending
history will be saved independently of task or apps
history can be stored in seprate files or it can saved parallel along with options
1] All => /task/api/v1/history/all
2] By Id => /task/api/v1/history/id/{id} // This id can be appId, taskId, componentId
Similar for component

apps path component should have support of adding extra data as like in task component

2017-06-09
==============
Api renamed :
/api/v1/components => /api/v1/component/all
/api/v1/components/{id} => /api/v1/component/id/{id}

Api deleted :
/api/v2/components/{id}
/api/v3/components/{id}

API improved

/api/v1/component/id/{id}
componentByIdV1
{
	id: string,
	taskDetails:
		- taskId: string
		  componentId: id
		  component: completeString
	appDetails:
		- appId: string
		  componentId: id
		  component: completeString
		  path: string
}

/api/v2/app/id/{id}
pathComponentResponseImprovedTo :
{
  - appId: string
    componentId: id
    component: completeString
    path: string
}

Bug fix for path is null
Remove unwanted logger
Added support for adding more data in pathComponent same as taskComponent