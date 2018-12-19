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

Example of EditConfigurations --> Program arguments
   - server meta-data/config/env_config.yml meta-data/config/app_config.yaml meta-data/config/app_config_2.yaml

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

2017-06-11
==============
Bug fix for
/task/api/v2/tasks/{id}
/task/api/v2/app/id/{id}

Multiple component was visible for the single entry if same component is used at multiple place in same app and
Same is reflected in the task componentDetails

2017-06-13
==============
Added two new api
/files/v1/download/view/file-name?name={file-name}
/files/v1/get/download/file-name?name={file-name}

Similar to => /files/v1/get/download?name={file-name}


2017-07-17
==============
New api added
1] Get api
/files/v1/add_text?fileName=xyz.txt&text=xyz
2] /view/build (But it is commented as of now)
3] /view/resource

Added extra field in appConfig
    - Home screen loading app resource
resourcePath: meta-data/config/available_resources.yaml
addTextPath: meta-data/files/temp/

Build created 1.3

1.4
=======
--------------------------------------------------
New api added
1] /config/api/v1/get/client-details
Response : CliientDetails

IpAddress class added
Width and height of text area for submit message increased to 310px and 150px

--------------------------------------------------
New api added
2] /task/api/v1/tasks/byid

Short by object array added in StringUtils class

--------------------------------------------------
Added facility to add multiple appConfiguration file

Converted
env_config => appConfigPath from String to ArrayList<String>
It can also empty array and can be loaded from run time using args

--------------------------------------------------
2017-11-10
app config created to work as standlone application

1.4.1
=======
--------------------------------------------------
2018-03-01
Added input to each component from reading output dynamically is used for special purpose for parsing component
so it should not be used for component info

1.4.2
=======
java -jar meta-data/todo-1.4.2-bita-SNAPSHOT.jar server meta-data/config/env_config.yml meta-data/config/app_config.yaml meta-data/config/app_config_2.yaml

--------------------------------------------------
2018-04-12
Remove two app config variable
taskComponentPath and taskHistoryPath as it was not required

1.4.1
=======
2018-03-01 (Actually added on 2018-04-16)
Added input to each component from reading output dynamically
~~~~~ is used for special purpose for parsing component so it should not be used for component info


1.4.3
=======
2018-09-27
Added session handler in project
Added socket v2 api so that tcpi/ip configuration can be saved in app config file

1.4.4
=======
2018-10-16

Added different fonts and symbols in assets folder

@font-face {
  font-family: 'Glyphicons Halflings';
  src: url(../fonts/glyphicons-halflings-regular.eot);
  src: url(../fonts/glyphicons-halflings-regular.eot?#iefix)
    format('embedded-opentype'),
    url(../fonts/glyphicons-halflings-regular.woff2) format('woff2'),
    url(../fonts/glyphicons-halflings-regular.woff) format('woff'),
    url(../fonts/glyphicons-halflings-regular.ttf) format('truetype'),
    url(../fonts/glyphicons-halflings-regular.svg#glyphicons_halflingsregular)
    format('svg')
}

@font-face {
  font-family: 'RobotoItalic';
  font-style: 'italic';
  font-weight: 400;
  src: local('Roboto Italic'), 
       local('Roboto-Italic'), 
       url(Roboto-Italic.ttf) 
       format('woff');
}

.glyphicon {
  position: relative;
  top: 1px;
  display: inline-block;
  font-family: 'Glyphicons Halflings';
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale
}

.glyphicon-asterisk:before {
  content: "\002a"
}

2018-11-19
===============
Created new project resource
/project => projectDashboard
/project/p0
/project/p0/p1
/project/p0/p1/p2
/project/p0/p1/p2/p3
/project/p0/p1/p2/p3/p4
/project/p0/p1/p2/p3/p4/p5
/project/p0/p1/p2/p3/p4/p5/p6
/project/p0/p1/p2/p3/p4/p5/p6/p7
/project/p0/p1/p2/p3/p4/p5/p6/p7/* => 404

If pattern matches at two places then first will get priority


Removed resource as it was not implemented properly

- /config/api/v1/get/files

Added get and update project-static-data api

- /config/api/v1/get/project-static-data
- /config/api/v1/update/project-static-data

Added appConfigParamaters
  indexPageReRoute: /config/api/v1/get/project-static-data
  projectStaticDataConfigPath:
    - meta-data/config/static_files.yaml
    - meta-data/config/static_files_b.yaml

1.4.5
===============
2018-12-05
===============
For appConfigParamaters
  indexPageReRoute: /config/api/v1/get/project-static-data

If app config is having multiple files then
    indexPageReRoute will be updated by the next files only when next file indexPageReRoute is not null

static_files data format
fileMapping:
  bootstrap-3.3.7-css: /assets/static/bootstrap-3.3.7-dist/css/bootstrap.css
  jquery-1.8.3-js: /assets/static/jquery-1.8.3.js
projectData:
  - version: projectDashboard
    title: Project Dashboard
    html: "<center>Project Dashboard</center>"
    config: test:string=123
    cssFiles:
      - bootstrap-3.3.7-css

1) version => string
  can be projectDashboard, v0, v1, ..., v7 (Total 8)
  projectViewVersion is passed from Project Resource
2) title => string
3) config => string
4) html => string
5) cssFiles => array of string
6) jsFiles => array of string
7) pattern => array of string
  pattern:
        - p0
        - p1
        - p2
        - p3
        - p4
        - p5
        - p6
        - p7
8) patternParams => array of string
  patternParams:
    - url-param-0
    - url-param-1
    .
    .
    .


1.4.6
=================
2018-12-06
=================
Added ui-view div in project.ftl

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
<#list projectViewParams.cssFiles as css>
    <link rel="stylesheet" type="text/css" href="${css}">
</#list>
    <title>${projectViewParams.title}</title>
</head>
<body>
    <div id="ui-view" class="ui-view"></div>
    <div style="display:none;">
        <input type="text" name="pathParams" value='<#list projectViewParams.pathParams as path>${path}/</#list>' />
        <input type="text" name="version" value='${projectViewParams.version}' />
        <input type="text" name="config" value='${projectViewParams.config}' />
    </div>
${projectViewParams.html}
<#if projectViewParams.projectNotFound>
    <center>Page not found : 404</center>
    <center><a href="/project">Goto Project Dashboard</a></center>
</#if>
<#list projectViewParams.jsFiles as js>
<script type="text/javascript" src="${js}"></script>
</#list>
</body>
</html>

Jquery 1.6.2.min changes => a.jQuery=a.$=a.$162=f;
Jquery 1.8.3 changes => window.jQuery = window.$ = window.$183 = jQuery;
Jquery 1.9.0 changes => window.jQuery = window.$ = window.$190 = jQuery;
Jquery 2.1.3 changes => window.jQuery = window.$ = window.$213 = jQuery;

Added AppConstant.AppVersion = 1.4.6
This constant is also added in client-details api
Pom file version updated from 1.4.5 to 1.4.6
Added log if appConfig parameters is replaced with new value for resourcePath, addTextPath and indexPageReRoute

Added trim before reroute from index page
Added version for loading index.js file for resource page index.ftl

1.5.0
==================
2018-12-09
==================
one more attribute paths added in taskApplication
paths:
  - name: string
    details: ArrayList<ArrayList<String>>

It help in rendering application path the way it is added in yaml file

Now taskApplications can have:
---
taskApplications
  - id: String
    paths:
      - name: String
        details: ArrayList<ArrayList<String>>
    path:
       String: String[][]
    options:
       String: String
    history:
       - String: String
         String: String
Try to avoid uring path instead use paths
2018-12-10
====================
Removed pathComponent from v2 and v3 api
Therefore v1 and v2 api will be same and v3 will contains history


/api/v1/app/all
/api/v2/app/all
/api/v3/app/all
/api/v1/app/id/{appId}
/api/v2/app/id/{appId}
/api/v3/app/id/{appId}

2018-12-11
===================
Added json dependencies in pom file
<dependency>
    <groupId>com.googlecode.json-simple</groupId>
    <artifactId>json-simple</artifactId>
    <version>1.1.1</version>
</dependency>

FileConfig class file deleted as it was redundent same thing was already in appConfig class

Remove taskConfigDB, filesConfig and projectStaticData from appConfig

Added private HashMap<String, String> jsonFileMapping in appConfig

  - appConfig file added one jsonFileMapping variable

jsonFileMapping:
  sample_json_file2: meta-data/config/sample_json_file.json


Removed api /config/api/v1/get/files as it was not required
Added api /files/v1/read_json for reading direct json file from api

Added two variable taskConfigDB and projectStaticData in config service similar to appConfig


2018-12-12
====================
Removed /config/api/v1/get/files from application_resource.yaml

2018-12-14
====================
Remove duplicate api

/task/api/v3/tasks
/task/api/v3/tasks/{taskId}
/task/api/v3/app/all
/task/api/v3/app/id/{appId}

Same is updated in meta-data/config/application_resource.yaml

2018-12-15
====================
1.5.0 projects urls are not working with java-1.7.1
Error in String.join replacing this with for-loop
Improved log if taskComponent or apps files are not found

2018-12-18
====================
Removed todo project from inteliji and reimported as maven project to fix importing erros
Created interface, implements and DB for YamlObject and TaskConfig

1.5.1
======
2018-12-18
====================
Added componentDetails in both tasks as well as in apps
For v2 both componentDetails and history will be available

If pathComponent is not found in taskComponents then it will add in pathsComponentDetails
component added extra for both taskComponentDetails and pathsComponentDetails
