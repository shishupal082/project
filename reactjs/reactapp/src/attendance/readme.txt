For display entry page
--------------------------------------------------------------------
resultPattern of summary, entry and update page should contains: userId
attendance table should contains: userId, date


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
    - entry, summary, ta
    - but not on update

2021-04-25
-----------------------

Added sortable heading for result pattern for all pages

Seprate resultPattern option is added for all 5 pages
    - entry, update, summary, ta, dbview

2021-05-26
-----------------------

List3Data for dbView

list3Data_2: [
        {
            "text": "Order by Date & Station 3",
            "value": [{"key": "date"}, {"key": "station"}, {"key": "date"}, {"key": "station"}, {"key": "deviceId"}]
        },
        {
            "text": "Order by Date & Station 3",
            "value": [{"key": "date"}, {"key": "station"}, {"key": "date"}, {"key": "station"}, {"key": "deviceId"}]
        }
]

[{"key": "date"}, {"key": "station"}, {"key": "date"}, {"key": "date"}]

- Two continuous entry of same key will be treated one

[{"key": "date"}, {"key": "station"}, {"key": "date"}, {"key": "station"}, {"key": "deviceId"}]
- Index for all date key will be 0 and all station heading will be 1
- Index for deviceId will be 4

2021-06-03
----------------
Added support for adding text with flexible dateTime and userId based on config file
New page added app: add_field_report

Added concept of redirect on page change using redirectPages config


