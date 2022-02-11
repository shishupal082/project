For display entry page
--------------------------------------------------------------------
resultPattern of summary, entry and update page should contains: userId
attendance table should contains: userId, date

"resultPattern": [
    {
        "tableName": "table1",
        "name": "id",
        "heading": "ID"
    },
    {
        "tableName": "table1",
        "name": "data1",
        "heading": "Data1"
    },
    {
        "tableName": "table1",
        "name": "data2",
        "heading": "Data2",
        "fieldName": "data1",
        "text": {"tag": "div","text": {"tag": "b", "name": "data1", "text": ""}}
    },
    {
        "tableName": "table2",
        "name": "id",
        "heading": "id"
    }
]


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

"addFieldReport.successRedirectPage": "dbview"
"addFieldReport.teamMapping": {
    "isSignalTeam": "Signal",
    "isTelecomTeam": "Telecom",
    "isSAndTTeam": "sAndT",
    "isAMCTeam": "AMC",
    "isSFRTeam": "SFR"
}
"addFieldReport.devices": [
    {
        "value": "Signal",
        "text": "Signal"
    },
    {
        "value": "Alarm",
        "text": "Alarm"
    }
]
"addFieldReport.stations": [
    {
        "value": "LTMD",
        "text": "LTMD"
    },
    {
        "value": "INFO",
        "text": "INFO"
    }
]
"addFieldReport.userIds": {
    "Signal": ["Signal_User1"],
    "Telecom": ["Telecom_User1"],
    "AMC": ["DL","EI","IPS"]
}



2022-02-10
----------------
"metaDataApi": ["/app/attendance/db-view/json/metaData.json"]

Mode of dataTable reading
1)
"dbDataApis": [
    {
        "tableName": "table1",
        "singleLineComment": ";",
        "dataIndex": ["id", "data1", "data2"],
        "apis": ["/app/attendance/db-view/csv/table1.csv"]
    }
]
2)
"getTableDataApiNameKey": "getTableData", // "getTableDataV2"
"tableFilterParam": {
    "filenames": "(field_report_(2021-(NOV|DEC))|(2022-(JAN|FEB)))|field_report_sfr_((2021-(NOV|DEC))|(2022-(JAN|FEB))).csv",
    "table_names": "(field_report|field_report_sfr)"
},
"dbTableDataIndex": {
    "field_report": ["uiUserId", "team", "station", "device", "description"],
    "field_report_sfr": ["uiUserId", "team", "station", "device", "description"]
},
"combineTableData": [
    {
        "sourceTableName": ["field_report_sfr"],
        "destinationTableName": "field_report"
    }
]
3)
"tcpConfig": {
    "info": "appId:002, wordId:NMS_Service",
    "tcpId": "id_002",
    "data": "002|NMS_Service|deleted = false|limit 2|all_filter_parameter"
}
dbViewData = {"tcp_table": {"tableData": []}}


"resultCriteria": [
    {
        "op": "==", // "!="
        "force1stEntry": true,
        "values": [
            {
                "tableName": "table1",
                "col": "id"
            },
            {
                "tableName": "table2",
                "col": "id"
            }
        ]
    }
]

"resultCriteria": [
    {
        "op": "==",
        "force1stEntry": true,
        "values": [
            {
                "tableName": "table1",
                "col": "userId"
            },
            {
                "tableName": "staff_movement",
                "col": "userId"
            }
        ],
        "result": {
            "tableName": "table1",
            "requiredData": [
                {
                    "tableName": "staff_movement",
                    "fieldName": "uiEntryTime"
                },
                {
                    "tableName": "staff_movement",
                    "fieldName": "userId"
                },
                {
                    "tableName": "staff_movement",
                    "fieldName": "team"
                },
                {
                    "tableName": "staff_movement",
                    "fieldName": "station"
                },
                {
                    "tableName": "staff_movement",
                    "fieldName": "device"
                },
                {
                    "tableName": "staff_movement",
                    "fieldName": "description"
                }
            ]
        }
    },
    {
        "op": "date==",
        "force1stEntry": true,
        "values": [
            {
                "tableName": "table1",
                "col": "uiEntryTime"
            },
            {
                "tableName": "table4",
                "col": "uiEntryTime"
            }
        ]
    }
]

