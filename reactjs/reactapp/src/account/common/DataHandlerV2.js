import $S from "../../interface/stack.js";
import DataHandler from "./DataHandler";
import AccountHelper from "./AccountHelper";
import TemplateHandler from "./TemplateHandler";
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
    _getFilterOptions: function() {
        var filterOptions = DataHandler.getData("filterOptions", []);
        var tempFilterOptions = [];
        if ($S.isArray(filterOptions)) {
            for (var i=0; i<filterOptions.length; i++) {
                if (!$S.isObject(filterOptions[i])) {
                    continue;
                }
                if (filterOptions[i]["dataKey"] === "accountName") {
                    continue;
                }
                tempFilterOptions.push(filterOptions[i]);
            }
        }
        return tempFilterOptions;
    },
    getFilterSelectedValuesByKey: function(key) {
        var selectedAccountName, selectedAccountArray = [];
        if (!$S.isStringV2(key)) {
            return selectedAccountArray;
        }
        var filterOptions = DataHandler.getData("filterOptions", []);
        if ($S.isArray(filterOptions)) {
            for (var i=0; i<filterOptions.length; i++) {
                if (!$S.isObject(filterOptions[i])) {
                    continue;
                }
                if (filterOptions[i]["dataKey"] === key) {
                    selectedAccountName = filterOptions[i]["selectedValue"];
                    break;
                }
            }
        }
        if ($S.isStringV2(selectedAccountName)) {
            selectedAccountArray = selectedAccountName.split(",");
        }
        return selectedAccountArray;
    },
    applyAccountNameFilter: function(dataByCompanyV2) {
        var selectedAccountArray = this.getFilterSelectedValuesByKey("accountName");
        var dataByCompanyV3 = [];
        if ($S.isArrayV2(selectedAccountArray) && $S.isArrayV2(dataByCompanyV2)) {
            for (var i=0; i<dataByCompanyV2.length; i++) {
                if ($S.isObject(dataByCompanyV2[i]) && $S.isStringV2(dataByCompanyV2[i]["accountName"])) {
                    if (selectedAccountArray.indexOf(dataByCompanyV2[i]["accountName"]) >= 0) {
                        dataByCompanyV3.push(dataByCompanyV2[i]);
                    }
                }
            }
        } else {
            dataByCompanyV3 = dataByCompanyV2;
        }
        return dataByCompanyV3;
    },
    applyAccountNameFilterV2: function(dataByCompany) {
        var selectedAccountArray = this.getFilterSelectedValuesByKey("accountName");
        var dataByCompanyV2 = {};
        if ($S.isArrayV2(selectedAccountArray) && $S.isObject(dataByCompany)) {
            for (var accountName in dataByCompany) {
                if ($S.isStringV2(accountName)) {
                    if (selectedAccountArray.indexOf(accountName) >= 0) {
                        dataByCompanyV2[accountName] = dataByCompany[accountName];
                    }
                }
            }
        } else {
            dataByCompanyV2 = dataByCompany;
        }
        return dataByCompanyV2;
    },
    _applyAccountNameFilterV2: function(dbViewDataTable) {
        var selectedAccountArray = this.getFilterSelectedValuesByKey("accountName");
        var drMatched, crMatched;
        var tempDbViewDataTable = [];
        if ($S.isArrayV2(dbViewDataTable) && $S.isArrayV2(selectedAccountArray)) {
            for (var i=0; i<dbViewDataTable.length; i++) {
                drMatched = false;
                crMatched = false;
                if ($S.isArray(dbViewDataTable[i])) {
                    for (var j=0; j<dbViewDataTable[i].length; j++) {
                        if ($S.isObject(dbViewDataTable[i][j]) && ["cr_account", "dr_account"].indexOf(dbViewDataTable[i][j]["name"]) >= 0) {
                            if (dbViewDataTable[i][j]["name"] === "cr_account") {
                                if (selectedAccountArray.indexOf(dbViewDataTable[i][j]["value"]) >= 0) {
                                    crMatched = true;
                                    break;
                                }
                            } else if (dbViewDataTable[i][j]["name"] === "dr_account") {
                                if (selectedAccountArray.indexOf(dbViewDataTable[i][j]["value"]) >= 0) {
                                    drMatched = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (crMatched || drMatched) {
                    tempDbViewDataTable.push(dbViewDataTable[i]);
                }
            }
        } else {
            tempDbViewDataTable = dbViewDataTable;
        }
        return tempDbViewDataTable;
    }
});
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
            journalEntry["category"] = entry["category"] ? entry["category"] : "Money";
            journalEntry["remarks"] = entry["remarks"] + " (From " + entry["cr_account"] + " To " + entry["dr_account"] + ")";
            journalEntry["dr_account"] = entry["dr_account"];
            journalEntry["cr_account"] = entry["cr_account"];
            journalEntry["dr_amount"] = entry["value"];
            journalEntry["cr_amount"] = entry["value"];
            journalEntry["value1"] = entry["value"];
            journalEntry["value2"] = entry["value"];
            journalEntry["particularEntry"] = [];
            journalEntry["particularEntry"].push({"dr": entry["value"], "account": entry["dr_account"], "particularText": journalEntry["remarks"]});
            journalEntry["particularEntry"].push({"cr": entry["value"], "account": entry["cr_account"], "particularText": journalEntry["remarks"]});
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
        var finalJournalDataByCategory = {}, category, dataByCompanyByCategory = {};
        var dataByCompany;
        if ($S.isArray(finalJournalData)) {
            for (var i=0; i<finalJournalData.length; i++) {
                if ($S.isObject(finalJournalData[i]) && $S.isArray(finalJournalData[i]["entry"])) {
                    for (var j=0; j<finalJournalData[i]["entry"].length; j++) {
                        if ($S.isObject(finalJournalData[i]["entry"][j])) {
                            category = finalJournalData[i]["entry"][j]["category"];
                            if ($S.isStringV2(category)) {
                                if (!$S.isArray(finalJournalDataByCategory[category])) {
                                    finalJournalDataByCategory[category] = [{"entry": []}];
                                }
                                finalJournalDataByCategory[category][0]["entry"].push(finalJournalData[i]["entry"][j]);
                            }
                        }
                    }
                }
            }
        }
        for (category in finalJournalDataByCategory) {
            dataByCompany = AccountHelper.getDataByCompany(finalJournalDataByCategory[category], accountData);
            dataByCompany = this.applyAccountNameFilterV2(dataByCompany);
            if ($S.isObjectV2(dataByCompany)) {
                dataByCompanyByCategory[category] = dataByCompany;
            }
        }
        return dataByCompanyByCategory;
    },
    getJournalDataV2: function(pageName) {
        var currentAppData = DataHandler.getCurrentAppData({});
        var metaData = DataHandler.getMetaData({});
        var dbViewDataTable = DataHandler.getData("dbViewDataTable", []);
        var currentList3Data = DataHandler.getCurrentList3Data();
        var dateParameterField = DataHandler.getAppData(pageName + ":dateParameterField", []);
        var dateSelect = DataHandler.getData("selectedDateType", "");
        var filterOptions = this._getFilterOptions();
        dbViewDataTable = AppHandler.getFilteredData(currentAppData, metaData, dbViewDataTable, filterOptions, "name");
        dbViewDataTable = this._applyAccountNameFilterV2(dbViewDataTable);
        var renderData = DBViewDataHandler.GenerateFinalDBViewData(dbViewDataTable, currentList3Data, dateParameterField, dateSelect);
        return renderData;
    },
    getJournalDataV3: function(pageName) {
        var currentAppData = DataHandler.getCurrentAppData({});
        var metaData = DataHandler.getMetaData({});
        var dbViewDataTable = DataHandler.getData("dbViewDataTable", []);
        var currentList3Data = DataHandler.getCurrentList3Data();
        var dateParameterField = DataHandler.getAppData(pageName + ":dateParameterField", []);
        var dateSelect = DataHandler.getData("selectedDateType", "");
        var filterOptions = this._getFilterOptions();
        dbViewDataTable = AppHandler.getFilteredData(currentAppData, metaData, dbViewDataTable, filterOptions, "name");
        var renderData = DBViewDataHandler.GenerateFinalDBViewData(dbViewDataTable, currentList3Data, dateParameterField, dateSelect);
        return renderData;
    }
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
    generateFinalTable: function(resultCriteria) {
        var pageName = DataHandler.getPathParamsData("pageName", "");
        var dbViewData = DataHandler.getData("dbViewData", {});
        var requiredDataTable = DataHandler.getAppData("pagePathName:" + pageName + ":requiredDataTable", []);
        var resultPatternKey = "pagePathName:" + pageName + ":resultPattern";
        var finalTable = [], resultPattern;
        if ([Config.journal].indexOf(pageName) < 0) {
            resultPatternKey = "pagePathName:" + Config.journalbydate + ":resultPattern";
        }
        if ([Config.summaryv2].indexOf(pageName) >= 0) {
            requiredDataTable = "accountal_data";
            resultPattern = TemplateHandler.getTemplate("custom.resultPattern", []);
        } else {
            resultPattern = DataHandler.getAppData(resultPatternKey, []);
        }
        // if ((!$S.isArray(resultPattern) || resultPattern.length < 1)) {
        //     if ([Config.dbview_summary, Config.custom_dbview].indexOf(pageName) >= 0) {
        //         resultPatternKey =  "resultPattern." + Config.dbview;
        //         resultPattern = $S.findParam([currentAppData, metaData], resultPatternKey, []);
        //     } else if ([Config.update].indexOf(pageName) >= 0) {
        //         resultPatternKey =  "resultPattern." + Config.entry;
        //         resultPattern = $S.findParam([currentAppData, metaData], resultPatternKey, []);
        //     } else if ([Config.summary].indexOf(pageName) >= 0) {
        //         resultPattern = this._getResultPatternFromData(pageName, currentAppData, metaData);
        //     }
        // }
        if ($S.isObject(dbViewData)) {
            if ($S.isObject(dbViewData["accountal_data"])) {
                if ($S.isArray(dbViewData["accountal_data"]["tableData"])) {
                    for (var i=0; i<dbViewData["accountal_data"]["tableData"].length; i++) {
                        if ($S.isObject(dbViewData["accountal_data"]["tableData"][i]) && !$S.isStringV2(dbViewData["accountal_data"]["tableData"][i]["category"])) {
                            dbViewData["accountal_data"]["tableData"][i]["category"] = "Money";
                        }
                    }
                }
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
                        DataHandler.setData("dbDataFromApis", tableData);
                        $S.callMethod(callback);
                    });
                });
            } else {
                $S.callMethod(callback);
            }
        }
    },
    loadTableData: function(getTableDataApiNameKey, tableFilterParam, dynamicFilenamesFilterParam, dbTableDataIndex, callback) {
        var url = CommonConfig.getApiUrl(getTableDataApiNameKey, null, true);
        DataHandler.setData("tableDataLoadStatus", "in_progress");
        AppHandler.LoadTableData(url, tableFilterParam, dynamicFilenamesFilterParam, dbTableDataIndex, function(database) {
            DataHandler.setData("tableDataLoadStatus", "completed");
            DataHandler.setData("dbDataTable", database);
            $S.callMethod(callback);
        });
    },
    generateCustomFieldsData: function(dbViewData) {
        var accountDataTableName = DataHandler.getAppData(Config.journal + ".tableName", "");
        var accountData;
        if (!$S.isObject(dbViewData) || !$S.isStringV2(accountDataTableName)) {
            return;
        }
        if ($S.isObject(dbViewData[accountDataTableName]) && $S.isArray(dbViewData[accountDataTableName]["tableData"])) {
            accountData = dbViewData[accountDataTableName]["tableData"];
            for (var i=0; i<accountData.length; i++) {
                if ($S.isObject(accountData[i])) {
                    accountData[i]["entry_details"] = TemplateHandler.getEntryDetails(accountData[i]);
                }
            }
        }
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
            case "journalbydate":
                renderData = this.getJournalDataV2(pageName);
            break;
            case "summaryv2":
                renderData = this.getJournalDataV3(pageName);
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
        var pageName = DataHandler.getPathParamsData("pageName", "");
        var currentAppData = DataHandler.getCurrentAppData();
        var metaData = DataHandler.getMetaData({});
        var filterSelectedValues = DataHandler.getData("filterValues", {});
        var dbViewDataTable = DataHandler.getData("dbViewDataTable", []);
        var filterKeyMapping = DataHandler.getAppData("pagePathName:" + pageName + ":filterKeyMapping");
        var tempDbViewDataTable = [], temp, isAdded, orgAccountName;
        if ($S.isArray(dbViewDataTable)) {
            for (var i=0; i<dbViewDataTable.length; i++) {
                isAdded = false;
                if ($S.isArray(dbViewDataTable[i])) {
                    for (var j=0; j<dbViewDataTable[i].length; j++) {
                        if ($S.isObject(dbViewDataTable[i][j])) {
                            if (["cr_account", "dr_account"].indexOf(dbViewDataTable[i][j]["name"]) >= 0) {
                                temp = dbViewDataTable[i];
                                orgAccountName = temp[j]["name"];
                                temp[j]["name"] = "accountName";
                                tempDbViewDataTable.push($S.clone(temp));
                                temp[j]["name"] = orgAccountName;
                                isAdded = true;
                            }
                        }
                    }
                }
                if (!isAdded) {
                    tempDbViewDataTable.push(dbViewDataTable[i]);
                }
            }
        }
        var filterOptions = AppHandler.generateFilterDataV2(filterKeyMapping, currentAppData, metaData, tempDbViewDataTable, filterSelectedValues, "name");
        DataHandler.setData("filterOptions", filterOptions);
        return true;
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
        var pageName1 = DataHandler.getData("pageName", "");
        var pageName2 = DataHandler.getPathParamsData("pageName", "");
        var currentList3Id = DataHandler.getData("currentList3Id", "");
        var currentList3Data = DataHandler.getCurrentList3Data();
        var i, list3Data, configList3Id, configList3Data;
        if (!$S.isStringV2(currentList3Id)) {
            if ([Config.otherPages].indexOf(pageName1) >= 0) {
                if (Config.otherPagesList.indexOf(pageName2) >= 0) {
                    configList3Id = DataHandler.getAppData("list3Data:" + pageName2 + ":selected", "");
                }
            }
            configList3Data = DataHandler.getList3DataById(configList3Id);
            if ($S.isObjectV2(configList3Data)) {
                currentList3Id = configList3Id;
                currentList3Data = configList3Data;
            }
        }
        if (!$S.isObjectV2(currentList3Data)) {
            // If currentList3Data not found (Like in the first time loading) then search defaultSelected item in list3Data
            list3Data = CommonDataHandler.getList3Data(DataHandler, DataHandler.getData("list3NameIdentifier", ""));
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
    }
});
})($S);

export default DataHandlerV2;
