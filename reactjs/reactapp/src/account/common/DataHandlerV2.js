import $S from "../../interface/stack.js";
import DataHandler from "./DataHandler";
import AccountHelper from "./AccountHelper";
import Config from "./Config";

import Api from "../../common/Api";
import AppHandler from "../../common/app/common/AppHandler";
import CommonConfig from "../../common/app/common/CommonConfig";
import CommonDataHandler from "../../common/app/common/CommonDataHandler";


import DBViewDataHandler from "../../common/app/common/DBViewDataHandler";

var DataHandlerV2;

(function($S){
var DT = $S.getDT();
DataHandlerV2 = function(arg) {
    return new DataHandlerV2.fn.init(arg);
};
DataHandlerV2.fn = DataHandlerV2.prototype = {
    constructor: DataHandlerV2,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};

$S.extendObject(DataHandlerV2);

DataHandlerV2.extend({
    createDateSelectionParameter: function() {
        var journalData = this.getJournalData(Config.journal);
        var allDateStr = [], i, temp;
        if ($S.isArray(journalData)) {
            for (i = 0; i < journalData.length; i++) {
                if ($S.isObject(journalData[i]) && $S.isStringV2(journalData[i]["uiEntryTime"])) {
                    temp = journalData[i]["uiEntryTime"];
                    temp = DT.getDateObj(temp);
                    if (temp !== null) {
                        temp = DT.formateDateTime("YYYY/-/MM/-/DD", "/", temp);
                        if (allDateStr.indexOf(temp) < 0) {
                            allDateStr.push(temp);
                        }
                    }
                }
            }
        }
        var allDateSelection = CommonDataHandler.generateDateSelectionParameter(allDateStr);
        var dateSelectionType = DataHandler.getData("selectedDateType", "");
        DataHandler.setData("combinedDateSelectionParameter", allDateSelection);
        DataHandler.setData("dateSelectionParameter", allDateSelection[dateSelectionType]);
    },
    _createJournalEntry: function(entry) {
        var journalEntry = {};
        if ($S.isObject(entry) && $S.isStringV2(entry["uiEntryTime"])) {
            journalEntry["date"] = entry["uiEntryTime"];
            journalEntry["uiEntryTime"] = entry["uiEntryTime"];
            journalEntry["category"] = entry["category"];
            journalEntry["remarks"] = entry["remarks"];
            journalEntry["dr_account"] = entry["dr_account"];
            journalEntry["cr_account"] = entry["cr_account"];
            journalEntry["value1"] = entry["value"];
            journalEntry["value2"] = entry["value"];
            journalEntry["particularEntry"] = [];
            journalEntry["particularEntry"].push({"dr": entry["value"], "account": entry["dr_account"], "particularText": entry["remarks"]});
            journalEntry["particularEntry"].push({"cr": entry["value"], "account": entry["cr_account"], "particularText": entry["remarks"]});
        }
        return journalEntry;
    },
    _getApiJournalData: function() {
        var journalData = this.getJournalData(Config.journal);
        var apiJournalData = [];
        if ($S.isArray(journalData)) {
            apiJournalData.push({"entry": []});
            for (var i=0; i<journalData.length; i++) {
                apiJournalData[0]["entry"].push(this._createJournalEntry(journalData[i]));
            }
        }
        return apiJournalData;
    },
    getAccountData: function() {
        var accountData = [], temp = [], i;
        var journalData = this.getJournalData();
        if ($S.isArray(journalData)) {
            for(i=0; i<journalData.length; i++) {
                if ($S.isStringV2(journalData[i]["cr_account"])) {
                    if (temp.indexOf(journalData[i]["cr_account"]) < 0) {
                        // accountData.push({"accountName": journalData[i]["cr_account"]});
                        temp.push(journalData[i]["cr_account"]);
                    }
                }
                if ($S.isStringV2(journalData[i]["dr_account"])) {
                    if (temp.indexOf(journalData[i]["dr_account"]) < 0) {
                        // accountData.push({"accountName": journalData[i]["dr_account"]});
                        temp.push(journalData[i]["dr_account"]);
                    }
                }
            }
        }
        temp = temp.sort();
        for(i=0; i<temp.length; i++) {
            accountData.push({"accountName": temp[i]});
        }
        return accountData;
    },
    getJournalData: function(pageName) {
        var tableName = DataHandler.getAppData(Config.journal + ".tableName");
        var tableData = CommonDataHandler.getTableData(DataHandler, tableName);
        return tableData;
    },
    getJournalDataByDate: function(pageName) {
        var apiJournalData = this._getApiJournalData();
        var journalDataByDate = AccountHelper.getApiJournalDataByDate(apiJournalData);
        return journalDataByDate;
    },
    getCurrentBalDataByDate: function(pageName) {
        var journalDataByDate = this.getJournalDataByDate(pageName);
        var accountData = this.getAccountData();
        var finalJournalData = AccountHelper.getFinalJournalData(journalDataByDate, accountData);
        var dataByCompany = AccountHelper.getDataByCompany(finalJournalData, accountData);
        return dataByCompany;
    },
});

DataHandlerV2.extend({
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
                        urls[j] = Config.baseApi + el + "&requestId=" + Config.requestId;
                    } else {
                        urls[j] = Config.baseApi + el + "?requestId=" + Config.requestId;
                    }
                }
                if (urls.length < 1) {
                    continue;
                }
                temp = {};
                temp.apis = dbDataApis[i].apis;
                temp.dataIndex = dbDataApis[i].dataIndex;
                temp.wordBreak = dbDataApis[i].wordBreak;
                temp.skipEmpty = dbDataApis[i].skipEmpty;
                temp.apiName = dbDataApis[i].tableName.trim();
                temp.singleLineComment = dbDataApis[i].singleLineComment;
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
    _loadTcpFileData: function(filepath, callback) {
        var tcpFileDataRequest = {
                            "url": [Config.baseApi + "/view/file/" + filepath + "?iframe=false&u=" + AppHandler.GetUserData("username", "")],
                            "apiName": "tcpFileData",
                            "requestMethod": Api.getAjaxApiCallMethod()};
        var request = [];
        request.push(tcpFileDataRequest);
        AppHandler.LoadDataFromRequestApi(request, function() {
            if ($S.isArray(request[0].response) && request[0].response.length > 0) {
                $S.callMethodV1(callback, request[0].response[0]);
            } else {
                $S.callMethodV1(callback, []);
            }
        });
    },
    _getTcpTableData: function(tcpResponse, callback) {
        tcpResponse = AppHandler.ParseTcpResponseJson(tcpResponse, []);
        if ($S.isObject(tcpResponse)) {
            if (tcpResponse.type === "data") {
                if ($S.isArray(tcpResponse.response)) {
                    $S.callMethodV1(callback, tcpResponse.response);
                } else {
                    $S.callMethodV1(callback, []);
                }
            } else if (tcpResponse.type === "file") {
                if ($S.isStringV2(tcpResponse.filepath)) {
                    this._loadTcpFileData(tcpResponse.filepath, function(data) {
                        $S.callMethodV1(callback, data);
                    });
                } else {
                    $S.callMethodV1(callback, []);
                }
            }
        } else {
            $S.callMethodV1(callback, []);
        }
    },
    _callTcpService: function(callback) {
        var tcpConfig = DataHandler.getAppData("tcpConfig", {});
        var apiUrl = CommonConfig.getApiUrl("tcpServicePostApi", "", true);
        var postData = {};
        var jsonResponse = {"tcp_table": {"tableData": []}};
        var self = this;
        var username = AppHandler.GetUserData("username", "");
        if ($S.isStringV2(apiUrl) && $S.isObject(tcpConfig)) {
            if ($S.isStringV2(tcpConfig["tcpId"]) && $S.isStringV2(tcpConfig["data"])) {
                postData["data"] = tcpConfig["data"];
                postData["tcp_id"] = tcpConfig["tcpId"];
                if ($S.isBooleanTrue(tcpConfig["addUsername"])) {
                    postData["data"] += username + "|" + username;
                }
                $S.sendPostRequest(Config.JQ, apiUrl, postData, function(ajax, status, response) {
                    if ($S.isObject(response)) {
                        self._getTcpTableData(response.data, function(tableData) {
                            jsonResponse["tcp_table"]["tableData"] = tableData;
                            $S.callMethodV1(callback, jsonResponse);
                        });
                    } else {
                        $S.callMethodV1(callback, jsonResponse);
                    }
                });
            } else {
                $S.callMethodV1(callback, jsonResponse);
            }
        } else {
            $S.callMethodV1(callback, jsonResponse);
        }
    },
    applyDefaultSort: function() {
        var dbViewData = DataHandler.getData("dbViewData", {});
        var defaultSorting = DataHandler.getAppData("defaultSorting", []);
        DBViewDataHandler.SortTableData(dbViewData, defaultSorting);
        DataHandler.setData("dbViewData", dbViewData);
    },
    _getResultPatternFromData: function(pageName, currentAppData, metaData) {
        var resultPattern = $S.findParam([currentAppData, metaData], "resultPattern.entry" , []);
        var attendanceDataKey = $S.findParam([currentAppData, metaData], "attendanceDataKey" , "");
        var i, summaryKey = [];
        if (!$S.isStringV2(attendanceDataKey)) {
            attendanceDataKey = "type";
        }
        var attendanceData = this._getAttendanceData();
        if ($S.isArray(attendanceData)) {
            for (i=0; i<attendanceData.length; i++) {
                if (!$S.isObject(attendanceData[i])) {
                    continue;
                }
                if ($S.isStringV2(attendanceData[i][attendanceDataKey])) {
                    if (summaryKey.indexOf(attendanceData[i][attendanceDataKey]) < 0) {
                        summaryKey.push(attendanceData[i][attendanceDataKey]);
                    }
                }
            }
        }
        if ($S.isArray(resultPattern) && resultPattern.length > 0) {
            summaryKey = summaryKey.sort();
            for (i=0; i<summaryKey.length; i++) {
                resultPattern.push({
                    "name": summaryKey[i],
                    "isSortable": true,
                    "pattern": [summaryKey[i]]
                });
            }
        }
        return resultPattern;
    },
    generateFinalTable: function(resultCriteria) {
        var pageName = DataHandler.getPathParamsData("pageName", "");
        var dbViewData = DataHandler.getData("dbViewData", {});
        var requiredDataTable = DataHandler.getAppData("requiredDataTable." + pageName, []);
        var metaData = DataHandler.getMetaData({});
        var currentAppData = DataHandler.getCurrentAppData({});
        var resultPatternKey = "resultPattern."+pageName;
        var resultPattern = $S.findParam([currentAppData, metaData], resultPatternKey, []);
        var finalTable = [];
        if ((!$S.isArray(resultPattern) || resultPattern.length < 1)) {
            if ([Config.dbview_summary, Config.custom_dbview].indexOf(pageName) >= 0) {
                resultPatternKey =  "resultPattern." + Config.dbview;
                resultPattern = $S.findParam([currentAppData, metaData], resultPatternKey, []);
            } else if ([Config.update].indexOf(pageName) >= 0) {
                resultPatternKey =  "resultPattern." + Config.entry;
                resultPattern = $S.findParam([currentAppData, metaData], resultPatternKey, []);
            } else if ([Config.summary].indexOf(pageName) >= 0) {
                resultPattern = this._getResultPatternFromData(pageName, currentAppData, metaData);
            }
        }
        finalTable = DBViewDataHandler.GetFinalTable(dbViewData, resultPattern, resultCriteria, requiredDataTable);
        DataHandler.setData("dbViewDataTable", finalTable);
    },
    handlePageLoad: function(dbDataApis, callback) {
        var keys = ["appControlDataLoadStatus", "metaDataLoadStatus"];
        var status = CommonDataHandler.getDataLoadStatusByKeyV2(DataHandler, keys);
        var tableData;
        var self = this;
        if (status === "completed") {
            status = DataHandler.getData("dbDataLoadStatus");
            if (status === "not-started") {
                DataHandler.setData("dbDataLoadStatus", "in_progress");
                this._loadDBViewData(dbDataApis, function(request) {
                    tableData = AppHandler.GenerateDatabaseV2(request);
                    self._callTcpService(function(jsonResponse) {
                        DataHandler.setData("dbDataLoadStatus", "completed");
                        tableData = AppHandler.MergeDatabase(tableData, jsonResponse);
                        DataHandler.setData("dbViewData", tableData);
                        $S.callMethod(callback);
                    });
                });
            } else {
                $S.callMethod(callback);
            }
        }
    },
    loadTableData: function(getTableDataApiNameKey, tableFilterParam, dynamicFilenamesFilterParam, dbTableDataIndex, callback) {
        var dbViewData;
        var url = CommonConfig.getApiUrl(getTableDataApiNameKey, null, true);
        DataHandler.setData("tableDataLoadStatus", "in_progress");
        AppHandler.LoadTableData(url, tableFilterParam, dynamicFilenamesFilterParam, dbTableDataIndex, function(database) {
            DataHandler.setData("tableDataLoadStatus", "completed");
            dbViewData = DataHandler.getData("dbViewData", {});
            if ($S.isObject(database)) {
                dbViewData = AppHandler.MergeDatabase(dbViewData, database);
            }
            DataHandler.setData("dbViewData", dbViewData);
            $S.callMethod(callback);
        });
    },
    getRenderData: function() {
        var pageName = DataHandler.getData("pageName", "");
        if ([Config.home, Config.projectHome, Config.noMatch].indexOf(pageName) >= 0) {
            return [];
        }
        pageName = DataHandler.getPathParamsData("pageName", "");
        if (CommonDataHandler.isPageDisabled(pageName)) {
            return [];
        }
        var renderData;
        switch(pageName) {
            case "journal":
                renderData = this.getJournalData(pageName);
            break;
            case "journalbydate":
                renderData = this.getJournalDataByDate(pageName);
            break;
            case "currentbalbydate":
            case "currentbalbydatev2":
            case "summary":
            case "accountsummarybydate":
            case "accountsummarybycalander":
            case "profitandloss":
            case "trialbalance":
            case "ledger":
            case "customisecredit":
            case "customisedebit":
            case "custompage":
                renderData = this.getCurrentBalDataByDate(pageName);
            break;
            default:
            break;
        }
        return renderData;
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

DataHandlerV2.extend({
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
    setCurrentList3Id: function() {
        // var pageName = DataHandler.getPathParamsData("pageName", "");
        // var currentList3Id = DataHandler.getData("currentList3Id", "");
        // var currentList3Data = DataHandler.getCurrentList3Data();
        // var i, list3Data, configList3Id, configList3Data;
        // if (!$S.isStringV2(currentList3Id)) {
        //     if ([Config.entry, Config.update, Config.summary].indexOf(pageName) >= 0) {
        //         configList3Id = DataHandler.getAppData(pageName + ".list3Data_1.selected", "");
        //     } else if ([Config.dbview, Config.dbview_summary, Config.add_field_report].indexOf(pageName) >= 0) {
        //         configList3Id = DataHandler.getAppData(pageName + ".list3Data_2.selected", "");
        //     }
        //     configList3Data = DataHandler.getList3DataById(configList3Id);
        //     if ($S.isObjectV2(configList3Data)) {
        //         currentList3Id = configList3Id;
        //         currentList3Data = configList3Data;
        //     }
        // }
        // if ([Config.custom_dbview].indexOf(pageName) >= 0) {
        //     configList3Id = DataHandler.getAppData(pageName + ".list3Data_2.selected", "");
        //     if ($S.isString(configList3Id)) {
        //         currentList3Id = configList3Id;
        //     }
        // } else if (!$S.isObjectV2(currentList3Data)) {
        //     // If currentList3Data not found (Like in the first time loading) then search defaultSelected item in list3Data
        //     list3Data = this.getList3Data();
        //     if ($S.isArray(list3Data)) {
        //         for (i = 0; i < list3Data.length; i++) {
        //             if ($S.isObject(list3Data[i])) {
        //                 if ($S.isBooleanTrue(list3Data[i].defaultSelected)) {
        //                     currentList3Id = list3Data[i].name;
        //                     break;
        //                 }
        //             }
        //         }
        //     }
        // }
        // DataHandler.setData("currentList3Id", currentList3Id);
        // return currentList3Id;
    }
});
})($S);

export default DataHandlerV2;
