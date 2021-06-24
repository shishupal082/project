import $S from "../../interface/stack.js";
import DataHandler from "./DataHandler";
import Config from "./Config";


import Api from "../../common/Api";
import AppHandler from "../../common/app/common/AppHandler";

import DBViewDataHandler from "../../common/app/common/DBViewDataHandler";
// import TemplateHelper from "../../common/TemplateHelper";

var DataHandlerV3;

(function($S){
DataHandlerV3 = function(arg) {
    return new DataHandlerV3.fn.init(arg);
};
DataHandlerV3.fn = DataHandlerV3.prototype = {
    constructor: DataHandlerV3,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};

$S.extendObject(DataHandlerV3);

DataHandlerV3.extend({
    _isValidTableEntry: function(dbApi) {
        if (!$S.isObject(dbApi)) {
            return false;
        }
        if (!$S.isString(dbApi.tableName) || dbApi.tableName.trim().length < 1) {
            return false;
        }
        if (!$S.isArray(dbApi.apis)) {
            return false;
        }
        return true;
    },
    _loadDBViewData: function(dbDataApis, callback) {
        var request = [], i, j, el, temp, urls;
        if ($S.isArray(dbDataApis) && dbDataApis.length > 0) {
            for(i=0; i<dbDataApis.length; i++) {
                if (!this._isValidTableEntry(dbDataApis[i])) {
                    continue;
                }
                urls = dbDataApis[i].apis.filter(function(el, j, arr) {
                    if ($S.isString(el) && el.length > 0) {
                        return true;
                    }
                    return false;
                });
                for (j=0; j<urls.length; j++) {
                    el = urls[j];
                    if ($S.isString(el) && el.split("?").length > 1) {
                        urls[j] = Config.baseApi + el + "&requestId=" + Config.requestId + "&temp_file_name=" + i;
                    } else {
                        urls[j] = Config.baseApi + el + "?requestId=" + Config.requestId + "&temp_file_name=" + i;
                    }
                }
                if (urls.length < 1) {
                    continue;
                }
                temp = {};
                temp.apis = dbDataApis[i].apis;
                temp.dataIndex = dbDataApis[i].dataIndex;
                temp.wordBreak = dbDataApis[i].wordBreak;
                temp.apiName = dbDataApis[i].tableName.trim();
                temp.requestMethod = Api.getAjaxApiCallMethodV2();
                temp.url = urls;
                request.push(temp);
            }
        }
        if (request.length < 1) {
            $S.callMethod(callback);
        } else {
            AppHandler.LoadDataFromRequestApi(request, function() {
                if ($S.isFunction(callback)) {
                    callback(request);
                }
            });
        }
    },
    _handleDefaultSorting: function(tableData) {
        if (!$S.isObject(tableData)) {
            return;
        }
        var currentAppData = DataHandler.getCurrentAppData({});
        var metaData = DataHandler.getMetaData({});
        var defaultSorting = $S.findParam([currentAppData, metaData], "defaultSorting", []);
        return DBViewDataHandler.SortTableData(tableData, defaultSorting);
    },
    generateFinalTable: function(currentList2Id, resultCriteria) {
        var tempDbViewData = DataHandler.getData("dbViewData", {});
        var attendanceData = DataHandler.getData("attendanceData", {});
        var requiredDataTable = DataHandler.getAppData("requiredDataTable." + currentList2Id, []);
        var metaData = DataHandler.getMetaData({});
        var currentAppData = DataHandler.getCurrentAppData({});
        var resultPatternKey = "resultPattern"+$S.capitalize(currentList2Id);
        var resultPattern = $S.findParam([currentAppData, metaData], resultPatternKey, []);
        var finalTable = [];
        if ([Config.dbview_summary, Config.custom_dbview].indexOf(currentList2Id) >= 0 && (!$S.isArray(resultPattern) || resultPattern.length < 1)) {
            resultPatternKey =  "resultPattern" + $S.capitalize(Config.dbview);
            resultPattern = $S.findParam([currentAppData, metaData], resultPatternKey, []);
        }
        var dbViewData = {};
        if ($S.isArray(requiredDataTable) && requiredDataTable.length > 0) {
            dbViewData = Object.assign(tempDbViewData, attendanceData);
        } else {
            dbViewData = tempDbViewData;
        }
        finalTable = DBViewDataHandler.GetFinalTable(dbViewData, resultPattern, resultCriteria, requiredDataTable);
        DataHandler.setData("dbViewDataTable", finalTable);
    },
    handlePageLoad: function(dbDataApis, callback) {
        var keys = ["appControlDataLoadStatus", "appRelatedDataLoadStatus"];
        var status = DataHandler.getDataLoadStatusByKey(keys);
        var tableData;
        if (status === "completed") {
            status = DataHandler.getData("dbViewDataLoadStatus");
            if (status === "not-started") {
                DataHandler.setData("dbViewDataLoadStatus", "in-progress");
                this._loadDBViewData(dbDataApis, function(request) {
                    DataHandler.setData("dbViewDataLoadStatus", "completed");
                    tableData = DBViewDataHandler.GenerateTableData(request);
                    DataHandlerV3._handleDefaultSorting(tableData);
                    DataHandler.setData("dbViewData", tableData);
                    $S.callMethod(callback);
                });
            } else {
                $S.callMethod(callback);
            }
        }
    },
    loadAttendanceData: function(attendanceDataApis, callback) {
        var tableData;
        DataHandlerV3._loadDBViewData(attendanceDataApis, function(request) {
            tableData = DBViewDataHandler.GenerateTableData(request);
            DataHandlerV3._handleDefaultSorting(tableData);
            DataHandler.setData("attendanceData", tableData);
            $S.callMethod(callback);
        });
    },
    generateFilterOptions: function() {
        var currentAppData = DataHandler.getCurrentAppData({});
        var dbViewDataTable = DataHandler.getData("dbViewDataTable", []);
        var metaData = DataHandler.getMetaData({});
        var filterSelectedValues = DataHandler.getData("filterValues", {});
        var filterOptions = AppHandler.generateFilterData(currentAppData, metaData, dbViewDataTable, filterSelectedValues, "name");
        DataHandler.setData("filterOptions", filterOptions);
        return dbViewDataTable;
    }
});

DataHandlerV3.extend({
    getList2Data: function() {
        var enabledPages = DataHandler.getAppData("enabledPages");
        var redirectPages = DataHandler.getAppData("redirectPages");
        var linkText = DataHandler.getAppData("linkText");
        if (!$S.isArray(enabledPages)) {
            enabledPages = [];
        }
        if (!$S.isObject(linkText)) {
            linkText = {};
        }
        var pages = Config.pages;
        var list2Data = [];
        var temp, i, key;
        temp = Object.keys(pages);
        var pageOrder = [];
        for(i=0; i<enabledPages.length; i++) {
            if (temp.indexOf(enabledPages[i]) >= 0) {
                pageOrder.push(enabledPages[i]);
            }
        }
        for(i=0; i<pageOrder.length; i++) {
            key = pageOrder[i];
            if ([Config.projectHome, Config.home].indexOf(key) < 0) {
                if ($S.isString(linkText[key])) {
                    temp = linkText[key];
                } else {
                    temp = $S.capitalize(key);
                }
                list2Data.push({"name": key, "toText": temp, "pageName": key});
            }
        }
        if ($S.isArray(redirectPages)) {
            for(i=0; i<redirectPages.length; i++) {
                temp = redirectPages[i];
                if (!$S.isObject(temp)) {
                    continue;
                }
                if (!$S.isStringV2(temp.name)) {
                    continue;
                }
                if (!$S.isStringV2(temp.toText)) {
                    continue;
                }
                if (!$S.isStringV2(temp.toUrl)) {
                    continue;
                }
                list2Data.push({"name": temp.name, "toText": temp.toText, "toUrl": temp.toUrl});
            }
        }
        return list2Data;
    },
    getList2DataByName: function(name) {
        var list2Data = this.getList2Data();
        if ($S.isArray(list2Data)) {
            for(var i=0; i<list2Data.length; i++) {
                if (!$S.isObject(list2Data[i])) {
                    continue;
                }
                if (list2Data[i].name === name) {
                    return list2Data[i];
                }
            }
        }
        return null;
    },
    getList3Data: function(pageName) {
        var metaData = DataHandler.getMetaData({});
        var currentAppData = DataHandler.getCurrentAppData({});
        var currentList2Id = DataHandler.getData("currentList2Id", "");
        var name = "list3Data", i;
        var allPages = Object.keys(Config.pages);
        if ([Config.home].indexOf(currentList2Id) >= 0) {
            var enabledPages = DataHandler.getAppData("enabledPages", []);
            if ($S.isArray(enabledPages)) {
                for (i = 0; i<enabledPages.length; i++) {
                    if ($S.isStringV2(enabledPages[i]) && allPages.indexOf(enabledPages[i]) >= 0) {
                        currentList2Id = enabledPages[i];
                        break;
                    }
                }
            }
        }
        if ([Config.entry, Config.update, Config.summary].indexOf(currentList2Id) >= 0) {
            name = "list3Data_1";
        } else if ([Config.dbview, Config.dbview_summary, Config.custom_dbview, Config.add_field_report].indexOf(currentList2Id) >= 0) {
            name = "list3Data_2";
        } else if ([Config.ta].indexOf(currentList2Id) >= 0) {
            name = "list3Data_3";
        } else {
            return [];
        }
        var list3Data = $S.findParam([currentAppData, metaData], name, []);
        if ($S.isArray(list3Data)) {
            for (i = 0; i < list3Data.length; i++) {
                if ($S.isObject(list3Data[i])) {
                    if (!$S.isString(list3Data[i].name)) {
                        list3Data[i].name = name + "-name-" + i;
                    }
                }
            }
        }
        return list3Data;
    },
    isPageDisabled: function(pageName) {
        if ([Config.projectHome, Config.home].indexOf(pageName) >= 0) {
            return false;
        }
        var enabledPages = DataHandler.getAppData("enabledPages");
        if ($S.isArray(enabledPages)) {
            return enabledPages.indexOf(pageName) < 0;
        }
        return true;
    },
    handleAttendanceDataLoad: function() {
        var attendanceDataTable = DataHandler.getData("attendanceData", []);
        var attendanceDataKey = DataHandler.getAppData("attendanceDataKey", "");
        var finalAttendanceData = {};
        var latestAttendanceData = {};
        var i, userId, temp, temp2, attendanceData;
        if ($S.isObject(attendanceDataTable)) {
            for(var tableName in attendanceDataTable) {
                if ($S.isObject(attendanceDataTable[tableName])) {
                    if ($S.isArray(attendanceDataTable[tableName].tableData)) {
                        attendanceData = attendanceDataTable[tableName].tableData;
                        break;
                    }
               }
            }
        }
        if (!$S.isArray(attendanceData)) {
            attendanceData = [];
        }
        if (!$S.isStringV2(attendanceDataKey)) {
            attendanceDataKey = "type";
        }
        for(i=0; i<attendanceData.length; i++) {
            if (!$S.isObject(attendanceData[i])) {
                continue;
            }
            if (!AppHandler.isValidDateStr(attendanceData[i]["date"])) {
                continue;
            }
            userId = attendanceData[i]["userId"];
            if (!$S.isString(userId) || userId.length < 1) {
                continue;
            }
            if (!$S.isObject(finalAttendanceData[userId])) {
                finalAttendanceData[userId] = {"attendance": []};
            }
            finalAttendanceData[userId].attendance.push(attendanceData[i]);
        }
        for(var key in finalAttendanceData) {
            if (!$S.isObject(latestAttendanceData[key])) {
                latestAttendanceData[key] = {"attendance": []};
            }
            if ($S.isArray(finalAttendanceData[key].attendance)) {
                temp = [];
                for(i=0; i<finalAttendanceData[key].attendance.length; i++) {
                    temp2 = finalAttendanceData[key].attendance[i];
                    if (temp.indexOf(temp2.date) < 0) {
                        temp.push(temp2.date);
                        temp2.type = temp2[attendanceDataKey];
                        if (temp2.type !== "") {
                            latestAttendanceData[key].attendance.push(temp2);
                        }
                    }
                }
            }
        }
        DataHandler.setData("latestAttendanceData", latestAttendanceData);
    },
    getCurrentList3Id: function() {
        var list2Id = DataHandler.getData("currentList2Id", "");
        var currentList3Id = DataHandler.getData("currentList3Id", "");
        var currentList3Data = DataHandler.getList3DataById(currentList3Id);
        var i, keys, list3Data, configList3Id;
        if ([Config.custom_dbview].indexOf(list2Id) >= 0) {
            configList3Id = DataHandler.getAppData(list2Id + ".list3Data_2.selected", "");
            if ($S.isString(configList3Id)) {
                currentList3Id = configList3Id;
            }
        } else if ($S.isObject(currentList3Data)) {
            keys = Object.keys(currentList3Data);
            // If currentList3Data not found (Like in the first time loading) then search defaultSelected item in list3Data
            if (keys.length < 1) {
                list3Data = this.getList3Data();
                if ($S.isArray(list3Data)) {
                    for (i = 0; i < list3Data.length; i++) {
                        if ($S.isObject(list3Data[i])) {
                            if ($S.isBooleanTrue(list3Data[i].defaultSelected)) {
                                currentList3Id = list3Data[i].name;
                                break;
                            }
                        }
                    }
                }
            }
        }
        return currentList3Id;
    },
    handleMetaDataLoad: function(metaDataResponse) {
        var finalMetaData = {}, i;
        var appControlMetaData = DataHandler.getData("appControlMetaData", {});
        if ($S.isObject(appControlMetaData)) {
            finalMetaData = appControlMetaData;
        }
        if ($S.isArray(metaDataResponse)) {
            for (i=0; i<metaDataResponse.length; i++) {
                if ($S.isObject(metaDataResponse[i])) {
                    finalMetaData = Object.assign(finalMetaData, metaDataResponse[i]);
                }
            }
        }
        DataHandler.setData("metaData", finalMetaData);
        var dateSelect = DataHandler.getData("date-select", "");
        if (dateSelect === "") {
            if ($S.isString(finalMetaData.dateSelect) && finalMetaData.dateSelect.length > 0) {
                dateSelect = finalMetaData.dateSelect;
            } else {
                dateSelect = Config.defaultDateSelect;
            }
        }
        DataHandler.setData("date-select", dateSelect);
        DataHandler.setData("currentList3Id", this.getCurrentList3Id());
    }
});
})($S);

export default DataHandlerV3;
