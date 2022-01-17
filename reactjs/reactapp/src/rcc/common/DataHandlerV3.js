import $S from "../../interface/stack.js";
import DataHandler from "./DataHandler";
import Config from "./Config";


import Api from "../../common/Api";
import AppHandler from "../../common/app/common/AppHandler";
import CommonConfig from "../../common/app/common/CommonConfig";

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
    _callUdpService: function(callback) {
        var tcpConfig = DataHandler.getAppData("tcpConfig", {});
        var apiUrl = Config.getApiUrl("udpServicePostApi", "", true);
        var postData = {};
        if ($S.isStringV2(apiUrl) && $S.isObject(tcpConfig)) {
            if ($S.isStringV2(tcpConfig["tcpId"]) && $S.isStringV2(tcpConfig["data"])) {
                    postData["data"] = tcpConfig["data"];
                    postData["tcp_id"] = tcpConfig["tcpId"];
                    $S.sendPostRequest(Config.JQ, apiUrl, postData, function(ajax, status, response) {
                    $S.callMethod(callback);
                });
            } else {
                $S.callMethod(callback);
            }
        } else {
            $S.callMethod(callback);
        }
    },
    _loadDBViewData: function(dbDataApis, callback) {
        this._callUdpService(function() {
            var ajaxApiCallMethod = Api.getAjaxApiCallMethod();
            var requestId = $S.getUniqueNumber();
            var request = AppHandler.GenerateApiRequest(dbDataApis, ajaxApiCallMethod, Config.baseApi, requestId);
            if (request.length < 1) {
                $S.callMethod(callback);
            } else {
                AppHandler.LoadDataFromRequestApi(request, function() {
                    if ($S.isFunction(callback)) {
                        callback(request);
                    }
                });
            }
        });
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
    // _getResultPatternFromData: function(pageName, currentAppData, metaData) {
    //     var resultPattern = $S.findParam([currentAppData, metaData], "resultPattern.entry" , []);
    //     var attendanceDataKey = $S.findParam([currentAppData, metaData], "attendanceDataKey" , "");
    //     var i, summaryKey = [];
    //     if (!$S.isStringV2(attendanceDataKey)) {
    //         attendanceDataKey = "type";
    //     }
    //     var attendanceData = this._getAttendanceData();
    //     if ($S.isArray(attendanceData)) {
    //         for (i=0; i<attendanceData.length; i++) {
    //             if (!$S.isObject(attendanceData[i])) {
    //                 continue;
    //             }
    //             if ($S.isStringV2(attendanceData[i][attendanceDataKey])) {
    //                 if (summaryKey.indexOf(attendanceData[i][attendanceDataKey]) < 0) {
    //                     summaryKey.push(attendanceData[i][attendanceDataKey]);
    //                 }
    //             }
    //         }
    //     }
    //     if ($S.isArray(resultPattern) && resultPattern.length > 0) {
    //         summaryKey = summaryKey.sort();
    //         for (i=0; i<summaryKey.length; i++) {
    //             resultPattern.push({
    //                 "name": summaryKey[i],
    //                 "isSortable": true,
    //                 "pattern": [summaryKey[i]]
    //             });
    //         }
    //     }
    //     return resultPattern;
    // },
    getFinalTable: function(tableData, resultCriteria) {
        var pageName = DataHandler.getPathParamsData("pageName", "");
        // var dbViewData = DataHandler.getData("dbViewData", {});
        var requiredDataTable = null;//DataHandler.getAppData("requiredDataTable." + pageName, []);
        var metaData = DataHandler.getMetaData({});
        var currentAppData = DataHandler.getCurrentAppData({});
        var resultPatternKey, resultPattern;
        var finalTable = [];
        if ([Config.rcc_view, Config.rcc_summary].indexOf(pageName) >= 0) {
            resultPatternKey =  "resultPattern." + Config.rcc_view;
            resultPattern = $S.findParam([currentAppData, metaData], resultPatternKey, []);
            finalTable = DBViewDataHandler.GetFinalTable(tableData, resultPattern, resultCriteria, requiredDataTable);
        }
        return finalTable;
    },
    generateFinalTable: function(resultCriteria) {
        var pageName = DataHandler.getPathParamsData("pageName", "");
        var dbViewData = DataHandler.getData("dbViewData", {});
        var requiredDataTable = DataHandler.getAppData("requiredDataTable." + pageName, []);
        var metaData = DataHandler.getMetaData({});
        var currentAppData = DataHandler.getCurrentAppData({});
        var resultPatternKey, resultPattern;
        var finalTable = [];
        if ([Config.dbview].indexOf(pageName) >= 0) {
            resultPatternKey =  "resultPattern." + pageName;
            resultPattern = $S.findParam([currentAppData, metaData], resultPatternKey, []);
            finalTable = DBViewDataHandler.GetFinalTable(dbViewData, resultPattern, resultCriteria, requiredDataTable);
        }
        DataHandler.setData("dbViewDataTable", finalTable);
    },
    parseSignal: function(str) {
        var result = [];
        if (!$S.isStringV2(str)) {
            return result;
        }
        var temp, temp2, temp3, temp4, i, j, k, l;
        var strArr = str.split(",");
        for (i=0; i<strArr.length; i++) {
            temp = strArr[i].trim().split("-");
            if (temp.length === 3) {
                temp2 = temp[0].split("/");
                temp3 = temp[1].split("/");
                temp4 = temp[2].split("/");
                for (j=0;j<temp2.length; j++) {
                    for (k=0; k<temp3.length; k++) {
                        for (l=0; l<temp4.length; l++) {
                            result.push(temp2[j] + "-" + temp3[k] + "-" + temp4[l]);
                        }
                    }
                }
            }
            if (temp.length === 2) {
                temp2 = temp[0].split("/");
                temp3 = temp[1].split("/");
                for (j=0;j<temp2.length; j++) {
                    for (k=0; k<temp3.length; k++) {
                        result.push(temp2[j] + "-" + temp3[k]);
                    }
                }
            }
        }
        return result;
    },
    generateRCCTableParameter: function(tableData) {
        if ($S.isObject(tableData)) {
            for (var tableName in tableData) {
                if ($S.isObject(tableData[tableName]) && $S.isArray(tableData[tableName].tableData)) {
                    for (var i=0; i<tableData[tableName].tableData.length; i++) {
                        if ($S.isObject(tableData[tableName].tableData[i])) {
                            for (var key in tableData[tableName].tableData[i]) {
                                if ($S.isString(tableData[tableName].tableData[i][key])) {
                                    if (["on_route", "conflicting", "in_isolation", "conflicting_route"].indexOf(key) >= 0) {
                                        tableData[tableName].tableData[i][key+"_signal"] = this.parseSignal(tableData[tableName].tableData[i][key]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return tableData;
    },
    handlePageLoad: function(dbDataApis, callback) {
        var keys = ["appControlDataLoadStatus", "metaDataLoadStatus"];
        var status = DataHandler.getDataLoadStatusByKey(keys);
        var tableData;
        if (status === "completed") {
            status = DataHandler.getData("dbDataLoadStatus");
            if (status === "not-started") {
                DataHandler.setData("dbDataLoadStatus", "in_progress");
                this._loadDBViewData(dbDataApis, function(request) {
                    DataHandler.setData("dbDataLoadStatus", "completed");
                    tableData = AppHandler.GenerateDatabaseV3(request);
                    tableData = DataHandlerV3.generateRCCTableParameter(tableData);
                    DataHandler.setData("dbViewData", tableData);
                    $S.callMethod(callback);
                });
            } else {
                $S.callMethod(callback);
            }
        }
    },
    loadTableData: function(getTableDataApiNameKey, tableFilterParam, dbTableDataIndex, combineTableData, callback) {
        var dbViewData;
        var url = CommonConfig.getApiUrl(getTableDataApiNameKey, null, true);
        DataHandler.setData("tableDataLoadStatus", "in_progress");
        AppHandler.LoadTableData(url, tableFilterParam, dbTableDataIndex, function(database) {
            DataHandler.setData("tableDataLoadStatus", "completed");
            dbViewData = DataHandler.getData("dbViewData", {});
            if ($S.isObject(database)) {
                dbViewData = AppHandler.MergeDatabase(dbViewData, database);
            }
            AppHandler.CombineTableData(dbViewData, combineTableData);
            DataHandlerV3._handleDefaultSorting(dbViewData);
            DataHandler.setData("dbViewData", dbViewData);
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
        var i, key;
        var temp = Object.keys(pages);
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
    getList3Data: function() {
        var metaData = DataHandler.getMetaData({});
        var currentAppData = DataHandler.getCurrentAppData({});
        var pageName = DataHandler.getPathParamsData("pageName", "");
        var name = "list3Data", i;
        if ([Config.rcc_view, Config.rcc_summary].indexOf(pageName) >= 0) {
            name = "list3Data_1";
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
    _getAttendanceData: function() {
        var attendanceDataTableName = DataHandler.getAppData("attendanceDataTableName", "");
        var dbViewData = DataHandler.getData("dbViewData", {});
        if ($S.isStringV2(attendanceDataTableName) && $S.isObjectV2(dbViewData)) {
            if ($S.isObject(dbViewData[attendanceDataTableName]) && $S.isArray(dbViewData[attendanceDataTableName]["tableData"])) {
                return dbViewData[attendanceDataTableName]["tableData"];
            }
        }
        return null;
    },
    handleAttendanceDataLoad: function() {
        var attendanceDataKey = DataHandler.getAppData("attendanceDataKey", "");
        var finalAttendanceData = {};
        var latestAttendanceData = {};
        var i, userId, temp, temp2;
        var attendanceData = this._getAttendanceData();
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
            if (!AppHandler.isValidDateStr(attendanceData[i]["uiEntryTime"])) {
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
                    if (temp.indexOf(temp2["uiEntryTime"]) < 0) {
                        temp.push(temp2["uiEntryTime"]);
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
    setCurrentList3Id: function() {
        var pageName = DataHandler.getPathParamsData("pageName", "");
        var currentList3Id = DataHandler.getData("currentList3Id", "");
        var currentList3Data = DataHandler.getCurrentList3Data();
        var i, list3Data, configList3Id, configList3Data;
        if (!$S.isStringV2(currentList3Id)) {
            if ([Config.entry, Config.update, Config.summary].indexOf(pageName) >= 0) {
                configList3Id = DataHandler.getAppData(pageName + ".list3Data_1.selected", "");
            } else if ([Config.dbview, Config.rcc_view].indexOf(pageName) >= 0) {
                configList3Id = DataHandler.getAppData(pageName + ".list3Data_2.selected", "");
            }
            configList3Data = DataHandler.getList3DataById(configList3Id);
            if ($S.isObjectV2(configList3Data)) {
                currentList3Id = configList3Id;
                currentList3Data = configList3Data;
            }
        }
        if ([Config.custom_dbview].indexOf(pageName) >= 0) {
            configList3Id = DataHandler.getAppData(pageName + ".list3Data_2.selected", "");
            if ($S.isString(configList3Id)) {
                currentList3Id = configList3Id;
            }
        } else if (!$S.isObjectV2(currentList3Data)) {
            // If currentList3Data not found (Like in the first time loading) then search defaultSelected item in list3Data
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
        DataHandler.setData("currentList3Id", currentList3Id);
        return currentList3Id;
    },
    handleMetaDataLoad: function(metaDataResponse) {
        var finalMetaData = {}, i, tempMetaData, temp;
        var appControlMetaData = DataHandler.getData("appControlMetaData", {});
        if ($S.isObject(appControlMetaData)) {
            finalMetaData = appControlMetaData;
        }
        if ($S.isArray(metaDataResponse)) {
            for (i=0; i<metaDataResponse.length; i++) {
                if ($S.isObject(metaDataResponse[i])) {
                    tempMetaData = metaDataResponse[i];
                    temp = tempMetaData.metaData;
                    if ($S.isObject(temp)) {
                        temp = Object.keys(temp);
                        if (temp.length > 0) {
                            tempMetaData = tempMetaData.metaData;
                        }
                    }
                    finalMetaData = Object.assign(finalMetaData, tempMetaData);
                }
            }
        }
        DataHandler.setData("metaData", finalMetaData);
        var dateSelect = DataHandler.getData("date-select", "");
        if (dateSelect === "") {
            dateSelect = DataHandler.getAppData("dateSelect", Config.defaultDateSelect);
        }
        DataHandler.setData("date-select", dateSelect);
        this.setCurrentList3Id();
    }
});
})($S);

export default DataHandlerV3;
