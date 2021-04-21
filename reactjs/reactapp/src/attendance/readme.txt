v1.0.0 (2021-04-16)
----------------------
Data entry app combined with attendance app
Now valid pages:
    - summary
    - entry
    - update
    - ta
ta:
    - added support for filter validation in upload data

2021-04-21
-----------------------
Bug fix
	- when routing from home to entry or any other page, it was displaying no data found
		- i.e. it was not waiting for load csv data from api
Added total entry in summary
Added sortable heading for name and station in
	- entry, summary and ta
	- but not on update
