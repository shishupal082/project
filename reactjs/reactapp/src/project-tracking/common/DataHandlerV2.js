import $S from "../../interface/stack.js";
import DataHandler from "./DataHandler";
import Config from "./Config";


import Api from "../../common/Api";
import AppHandler from "../../common/app/common/AppHandler";
import DBViewDataHandler from "../../common/app/common/DBViewDataHandler";

var DataHandlerV2;

(function($S){
// var DT = $S.getDT();
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
    getList2Data: function() {
        var metaData = DataHandler.getData("metaData", {});
        var currentAppData = DataHandler.getCurrentAppData();
        var enabledPages = $S.findParam([currentAppData, metaData, Config.tempConfig], "enabledPages");
        var redirectPages = $S.findParam([currentAppData, metaData, Config.tempConfig], "redirectPages");
        var linkText = $S.findParam([currentAppData, metaData, Config.tempConfig], "linkText");
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
            if (key !== "home") {
                if ($S.isString(linkText[key])) {
                    temp = linkText[key];
                } else {
                    temp = $S.capitalize(key);
                }
                list2Data.push({"name": key, "toText": temp, "toUrl": pages[key]});
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
        var pageName = DataHandler.getData("pageName", "");
        var name = pageName + ".list3Data";
        var list3Data = DataHandler.getAppData(name, []);
        if ($S.isArray(list3Data)) {
            for (var i = 0; i < list3Data.length; i++) {
                if ($S.isObject(list3Data[i])) {
                    if (!$S.isString(list3Data[i].name)) {
                        list3Data[i].name = name + "-name-" + i;
                    }
                }
            }
        }
        return list3Data;
    },
    generateFilterOptions: function(dbViewData) {
        var currentAppData = DataHandler.getCurrentAppData();
        var metaData = DataHandler.getData("metaData", {});
        var filterSelectedValues = DataHandler.getData("filterValues", {});
        var filterOptions = AppHandler.generateFilterData(currentAppData, metaData, dbViewData, filterSelectedValues, "name");
        DataHandler.setData("filterOptions", filterOptions);
        return dbViewData;
    },
    findCurrentList3Id: function() {
        var currentList3Data = DataHandler.getCurrentList3Data();
        var currentList3Id = DataHandler.getData("currentList3Id", "");
        var keys, list3Data;
        if ($S.isObject(currentList3Data)) {
            keys = Object.keys(currentList3Data);
            if (keys.length < 1) {
                list3Data = this.getList3Data();
                if ($S.isArray(list3Data)) {
                    for (var i = 0; i < list3Data.length; i++) {
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
        DataHandler.setData("currentList3Id", currentList3Id);
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
        this.findCurrentList3Id();
    }
});
DataHandlerV2.extend({
    _getUploadFileInfo: function(pid, pName) {
        var fileInfoTable = DataHandlerV2.getTableDataByAttr(DataHandler.getTableName("fileTable"), "pid", pid);
        var filePath, temp;
        if ($S.isArray(fileInfoTable)) {
            for(var i=0; i<fileInfoTable.length; i++) {
                if (!$S.isObject(fileInfoTable[i])) {
                    continue;
                }
                fileInfoTable[i].pName = pName;
                filePath = fileInfoTable[i].filename;
                if (!$S.isString(filePath)) {
                    filePath = "";
                }
                temp = filePath.split("/");
                if (temp.length !== 2) {
                    continue;
                }
                fileInfoTable[i].uploadedBy = temp[0];
            }
        }
        return fileInfoTable;
    },
    _getUpdateSupplyItemLink: function(pid, entry) {
        var tdFieldText = {"tag": "link", "text": "Update", "href": ""};
        var sid = "";
        if ($S.isObject(entry) && $S.isString(entry.sid)) {
            sid = entry.sid;
        }
        tdFieldText["href"] = DataHandler.getLink(pid, sid, "supply");
        return tdFieldText;
    },
    getProjectData: function() {
        var currentPId = DataHandler.getPathParamsData("pid");
        var projectTable = DataHandlerV2.getTableDataByAttr(DataHandler.getTableName("projectTable"), "pid", currentPId);
        var response = {"status": "SUCCESS"};
        if (projectTable.length !== 1) {
            response["status"] = "FAILURE";
            response["reason"] = "Invalid Project Id: " + currentPId;
        } else {
            response["pName"] = projectTable[0].pName;
            response["uploadedFileData"] = this._getUploadFileInfo(currentPId, response["pName"]);
        }
        return response;
    },
    getProjectWorkStatus: function(sortingFields) {
        var currentPId = DataHandler.getPathParamsData("pid");
        var response = this.getProjectData();
        var tableName = DataHandler.getTableName("projectWorkStatus");
        var workStatus = DataHandlerV2.getTableDataByAttr(tableName, "pid", currentPId);
        response["workStatus"] = workStatus;
        response["tableName"] = tableName;
        return response;
    },
    getProjectSupplyItems: function(sortingFields) {
        var currentPId = DataHandler.getPathParamsData("pid");
        var response = this.getProjectData();
        var tableName = DataHandler.getTableName("materialSupplyItems");
        var supplyItem = DataHandlerV2.getTableDataByAttr(tableName, "pid", currentPId);
        if ($S.isArray(supplyItem)) {
            for(var i=0; i<supplyItem.length; i++) {
                if (!$S.isObject(supplyItem[i])) {
                    continue;
                }
                supplyItem[i].update_item_link = this._getUpdateSupplyItemLink(currentPId, supplyItem[i]);
            }
        }
        response["supplyItem"] = supplyItem;
        response["tableName"] = tableName;
        return response;
    },
    getProjectSupplyStatus: function(sortingFields) {
        // var currentPId = DataHandler.getPathParamsData("pid");
        var supplyItemId = DataHandler.getPathParamsData("sid");
        var response = this.getProjectData();
        var tableName = DataHandler.getTableName("materialSupplyStatus");
        var supplyStatus = DataHandlerV2.getTableDataByAttr(tableName, "sid", supplyItemId);
        var supplyItemName = this.getDisplayName(DataHandler.getTableName("materialSupplyItems"), "sid", supplyItemId, "supply_item_name");
        // var projectName = this.getDisplayName(DataHandler.getTableName("projectTable"), "pid", currentPId, "pName");
        // if ($S.isArray(supplyStatus)) {
        //     for(var i=0; i<supplyStatus.length; i++) {
        //         if (!$S.isObject(supplyStatus[i])) {
        //             continue;
        //         }
        //         supplyStatus[i]["supplyItemName"] = supplyItemName;
        //         supplyStatus[i]["projectName"] = projectName;
        //     }
        // }
        response["supplyStatus"] = supplyStatus;
        response["supplyItemName"] = supplyItemName;
        response["tableName"] = tableName;
        return response;
    },
    getDisplaySypplyStatus: function(pageName, sortingFields) {
        var requiredDataTable = DataHandler.getAppData(pageName + ".requiredDataTable");
        var dbViewData = {}, i;
        if ($S.isArray(requiredDataTable)) {
            for (i=0; i<requiredDataTable.length; i++) {
                if ($S.isStringV2(requiredDataTable[i])) {
                    dbViewData[requiredDataTable[i]] = {"tableData": this.getTableData(requiredDataTable[i])};
                }
            }
        }
        var projectTableName = DataHandler.getTableName("projectTable");
        var supplyStatusTableName = DataHandler.getTableName("materialSupplyStatus");
        var tableData;
        if ($S.isObject(dbViewData[supplyStatusTableName]) && $S.isArray(dbViewData[supplyStatusTableName]["tableData"])) {
            tableData = dbViewData[supplyStatusTableName]["tableData"];
            for(i=0; i<tableData.length; i++) {
                if (!$S.isObject(tableData[i])) {
                    continue;
                }
                tableData[i]["projectName"] = this.getDisplayName(projectTableName, "pid", tableData[i]["pid"], "pName");
            }
        }
        this.generateFilterOptions(tableData);
        var resultPattern = DataHandler.getAppData(pageName + ".resultPattern");
        var resultCriteria = DataHandler.getAppData(pageName + ".resultCriteria");
        var finalTable = DBViewDataHandler.GetFinalTable(dbViewData, resultPattern, resultCriteria, null);
        return finalTable;
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
        DataHandlerV2._handleDefaultSorting(tableData);
        return tableData;
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
    getTableData: function(tableName) {
        if (!$S.isStringV2(tableName)) {
            return [];
        }
        var dbViewData = DataHandler.getData("dbViewData", {});
        var tableData = [];
        if ($S.isObject(dbViewData) && $S.isObject(dbViewData[tableName])) {
            if ($S.isArray(dbViewData[tableName].tableData)) {
                tableData = dbViewData[tableName].tableData;
            }
        }
        return tableData;
    },
    getTableDataByAttr: function(tableName, attrName, attrValue) {
        var tableData = this.getTableData(tableName);
        if (!$S.isArray(tableData) || !$S.isStringV2(attrName)) {
            return [];
        }
        var result = $S.searchItems([attrName], tableData, false, false, "i",
            function(searchingPattern, el, i, arr) {
                if (!$S.isObject(el)) {
                    return false;
                }
                return el[attrName] === attrValue;
            }
        );
        return result;
    },
    getDisplayName: function(tableName, searchKey, searchRef, requiredKey, defaultValue) {
        var tableData = this.getTableData(tableName);
        if (!$S.isArray(tableData) || !$S.isStringV2(searchKey) || !$S.isStringV2(requiredKey)) {
            return defaultValue;
        }
        var displayText = $S.findParam(tableData, searchRef, defaultValue, searchKey, requiredKey);
        return displayText;
    },
    _handleDefaultSorting: function(tableData) {
        if (!$S.isObject(tableData)) {
            return;
        }
        var currentAppData = DataHandler.getCurrentAppData();
        var metaData = DataHandler.getData("metaData", {});
        var defaultSorting = $S.findParam([currentAppData, metaData], "defaultSorting", []);
        return DBViewDataHandler.SortTableData(tableData, defaultSorting);
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
                    tableData = DataHandlerV2._getTableData(request);
                    DataHandler.setData("dbViewData", tableData);
                    $S.callMethod(callback);
                });
            } else {
                $S.callMethod(callback);
            }
        }
    }
});
})($S);

export default DataHandlerV2;
