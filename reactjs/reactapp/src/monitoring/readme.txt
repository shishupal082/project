Create new page
	- dashboard
	- add report
	- upload file

on add report and upload filter
	- create dropdown
		- select status
			- it can be failure, maintanance, mrdc, other-projects
		- select station
		- select component
			- it can be point, track-circuit, block-instrument, lc, lvcd, relay, signal-lamp, warning-board


save data formate for add report
DATE,status,station,device,description

save data for upload file
DATE,status,station,device,Uploaded file (filename)

when a file is deleted (It will not be tracked as it will be in the seprate csv file)

General info
--------------
saved csv data formate
DATE,status,station,device,description

Load appControlData.json based on username, this information is available in user profile data
	- userDepenedentAppControlExist
if yes
	- assign Config.appControlApi to <public file path>
	- proper perission shall be added for that file

if no
	- load appControlData from default api


1.0.1
--------------
Bug fix for independent loading of metaData and csvData

Added support for adding multiple metaData.json files
	- all will be merged


Load user profile data and available files info for that user

Update csvDataApi path if csv file is present

Update table entry heading from metaData.json

Update url for appControlApi if userDepenedentAppControlExist

If user is not login, redirect to login page
	- configurable with forceLogin parameter


Todo
--------------
If more comma found then merge all data after 4th comma
Create page for uploading data, uploading file and dashboard view
In the heading add login user information
	- Login as: <username>
Give logout link

