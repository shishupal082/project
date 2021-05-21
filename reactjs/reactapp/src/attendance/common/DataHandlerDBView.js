import $S from "../../interface/stack.js";
import DataHandler from "./DataHandler";
import Config from "./Config";


import Api from "../../common/Api";
import AppHandler from "../../common/app/common/AppHandler";

var DataHandlerDBView;

(function($S){
DataHandlerDBView = function(arg) {
    return new DataHandlerDBView.fn.init(arg);
};
DataHandlerDBView.fn = DataHandlerDBView.prototype = {
    constructor: DataHandlerDBView,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};

$S.extendObject(DataHandlerDBView);

DataHandlerDBView.extend({
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
    _getTableData: function(request) {
        var tableData = {}, i, temp;
        var wordBreak;
        if ($S.isArray(request)) {
            for(i=0; i<request.length; i++) {
                if (!$S.isObject(request[i])) {
                    continue;
                }
                if (!$S.isString(request[i].apiName) || request[i].apiName.length < 1) {
                    continue;
                }
                if ($S.isUndefined(tableData[request[i].apiName])) {
                    tableData[request[i].apiName] = {};
                }
                tableData[request[i].apiName]["tableName"] = request[i].apiName;
                tableData[request[i].apiName]["dataIndex"] = request[i].dataIndex;
                tableData[request[i].apiName]["apis"] = request[i].apis;
                tableData[request[i].apiName]["wordBreak"] = request[i].wordBreak;
                tableData[request[i].apiName]["response"] = request[i].response;
            }
        }
        for(var key in tableData) {
            tableData[key]["responseJson"] = [];
            wordBreak = tableData[key].wordBreak;
            if ($S.isArray(tableData[key]["response"])) {
                for(i=0; i<tableData[key]["response"].length; i++) {
                    temp = AppHandler.ParseTextData(tableData[key]["response"][i], wordBreak, false, true);
                    tableData[key]["responseJson"] = tableData[key]["responseJson"].concat(temp);
                }
            }
            tableData[key]["tableData"] = AppHandler.ConvertJsonToTable(tableData[key]["responseJson"], tableData[key]["dataIndex"]);
        }
        DataHandlerDBView._handleDefaultSorting(tableData);
        return tableData;
    },
    _loadDBViewData: function(dbDataApis, callback) {
        var request = [], i, temp, urls;
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
                urls = urls.map(function(el, j, arr) {
                    return Config.baseApi + el + "?v=" + Config.requestId;
                });
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
    generateFinalTable: function() {
        var currentList2Id = DataHandler.getData("currentList2Id", "");
        var dbViewData = DataHandler.getData("dbViewData", {});
        var metaData = DataHandler.getData("metaData", {});
        var currentAppData = DataHandler.getCurrentAppData();
        currentList2Id = $S.capitalize(currentList2Id);
        var resultPatternKey = "resultPattern";
        var validResultPatternKeys = $S.findParam([currentAppData, metaData], "resultPatternKeys", []);
        if ($S.isArray(validResultPatternKeys) && validResultPatternKeys.indexOf("resultPattern"+currentList2Id) >= 0) {
            resultPatternKey = "resultPattern"+currentList2Id;
        }
        var resultPattern = $S.findParam([currentAppData, metaData], resultPatternKey, []);
        var resultCriteria = $S.findParam([currentAppData, metaData], "resultCriteria", []);
        var i, j, k, op, values, t1, t1Name, t2, t2Name;
        var finalTable = [], temp, temp2, tableName;
        var tempJoinResult = [];
        var force1stEntry, isNotMatching;
        if (!$S.isArray(resultPattern)) {
            resultPattern = [];
        }
        if (!$S.isArray(resultCriteria)) {
            resultCriteria = [];
        }
        if (resultCriteria.length === 0) {
            if ($S.isObject(dbViewData)) {
                for(tableName in dbViewData) {
                    t1 = dbViewData[tableName].tableData;
                    if ($S.isArray(t1)) {
                        for(i=0; i<t1.length; i++) {
                            temp = $S.clone(resultPattern);
                            for (j=0; j<temp.length; j++) {
                                t1Name = temp[j].tableName;
                                if (tableName === t1Name) {
                                    temp[j].value = t1[i][temp[j].name];
                                }
                            }
                            finalTable.push(temp);
                        }
                    }
                }
            }
        } else {
            for(i=0; i<resultCriteria.length; i++) {
                op = $S.findParam([resultCriteria[i]], "op");
                if ($S.isString(op)) {
                    values = $S.findParam([resultCriteria[i]], "values");
                    if ($S.isArray(values) && values.length === 2) {
                        force1stEntry = $S.findParam([resultCriteria[i]], "force1stEntry");
                        t1Name = values[0].tableName;
                        t2Name = values[1].tableName;
                        t1 = null;
                        t2 = null;
                        if ($S.isObject(dbViewData[t1Name])) {
                            t1 = dbViewData[t1Name].tableData;
                        }
                        if ($S.isObject(dbViewData[t2Name])) {
                            t2 = dbViewData[t2Name].tableData;
                        }
                        if (!$S.isArray(t1)) {
                            continue;
                        }
                        for(j=0; j<t1.length; j++) {
                            if (op === "==") {
                                if ($S.isBooleanTrue(force1stEntry)) {
                                    temp = {};
                                    temp[t1Name] = t1[j];
                                    isNotMatching = true;
                                    if ($S.isArray(t2)) {
                                        for(k=0; k<t2.length; k++) {
                                            if (t1[j][values[0].col] === t2[k][values[1].col]) {
                                                temp2 = $S.clone(temp);
                                                temp2[t2Name] = t2[k];
                                                isNotMatching = false;
                                                tempJoinResult.push(temp2);
                                            }
                                        }
                                    }
                                    if (isNotMatching) {
                                        tempJoinResult.push(temp);
                                    }
                                } else {
                                    if ($S.isArray(t2)) {
                                        for(k=0; k<t2.length; k++) {
                                            if (t1[j][values[0].col] === t2[k][values[1].col]) {
                                                temp = {};
                                                temp[t1Name] = t1[j];
                                                temp[t2Name] = t2[k];
                                                tempJoinResult.push(temp);
                                            }
                                        }
                                    }
                                }
                            } else if (op === "!=") {
                                isNotMatching = true;
                                if ($S.isArray(t2)) {
                                    for(k=0; k<t2.length; k++) {
                                        if (t1[j][values[0].col] === t2[k][values[1].col]) {
                                            isNotMatching = false;
                                            break;
                                        }
                                    }
                                }
                                if (isNotMatching) {
                                    temp = {};
                                    temp[t1Name] = t1[j];
                                    tempJoinResult.push(temp);
                                }
                            }
                        }
                    }
                }
            }
            for (i = 0; i < tempJoinResult.length; i++) {
                temp = $S.clone(resultPattern);
                for (j=0; j<temp.length; j++) {
                    t1Name = temp[j].tableName;
                    temp[j].value = $S.findParam([tempJoinResult[i][t1Name]], temp[j].name);
                }
                finalTable.push(temp);
            }
        }
        DataHandler.setData("dbViewDataTable", finalTable);
    },
    _handleDefaultSorting: function(tableData) {
        if (!$S.isObject(tableData)) {
            return;
        }
        var currentAppData = DataHandler.getCurrentAppData();
        var metaData = DataHandler.getData("metaData", {});
        var defaultSorting = $S.findParam([currentAppData, metaData], "defaultSorting", []);
        var i, j, tableName, temp;
        if ($S.isArray(defaultSorting)) {
            for(i=0; i<defaultSorting.length; i++) {
                if ($S.isObject(defaultSorting[i]) && $S.isString(defaultSorting[i].table)) {
                    if (defaultSorting[i].table.length === 0) {
                        continue;
                    }
                    if (!$S.isString(defaultSorting[i].index)) {
                        continue;
                    }
                    tableName = defaultSorting[i].table;
                    if (!$S.isObject(tableData[tableName])) {
                        continue;
                    }
                    if (!$S.isArray(tableData[tableName].tableData)) {
                        continue;
                    }
                    temp = [];
                    if ($S.isArray(tableData[tableName].tableData)) {
                        for(j=tableData[tableName].tableData.length-1; j>=0; j--) {
                            temp.push(tableData[tableName].tableData[j]);
                        }
                    }
                    tableData[tableName].tableData = $S.sortResult(temp, defaultSorting[i].sortableValue, defaultSorting[i].index, "name");
                }
            }
        }
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
                    tableData = DataHandlerDBView._getTableData(request);
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
        DataHandlerDBView._loadDBViewData(attendanceDataApis, function(request) {
            tableData = DataHandlerDBView._getTableData(request);
            if ($S.isFunction(callback)) {
                callback(tableData);
            }
        });
    }
});
DataHandlerDBView.extend({
    generateFilterOptions: function() {
        var dbViewDataTable = DataHandler.getData("dbViewDataTable", []);
        var metaDataTemp = {"filterKeys": [], "preFilter": {}};
        var metaData = DataHandler.getData("metaData", {});
        var currentAppData = DataHandler.getCurrentAppData();
        var filterSelectedValues = DataHandler.getData("filterValues", {});
        metaDataTemp["filterKeys"] = $S.findParam([currentAppData, metaData], "filterKeys", []);
        metaDataTemp["preFilter"] = $S.findParam([currentAppData, metaData], "preFilter", {});
        var filterOptions = AppHandler.generateFilterData(metaDataTemp, dbViewDataTable, filterSelectedValues, "name");
        DataHandler.setData("filterOptions", filterOptions);
        return dbViewDataTable;
    }
});

})($S);

export default DataHandlerDBView;
