import $S from "../../interface/stack.js";
import Config from "./Config";
import DataHandler from "./DataHandler";
import TemplateHandler from "./template/TemplateHandler";
import DisplayUploadedFiles from "./pages/DisplayUploadedFiles";

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
        var pageId = DataHandler.getPathParamsData("pageId", "");
        var key =  "pageId:" + pageId + ".list3DataKey";
        var name = DataHandler.getAppData(key, false);
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
        var pageId = DataHandler.getPathParamsData("pageId", "");
        var keyMapping = DataHandler.getAppData("pageId:" + pageId + ".filterKeyMapping", {});
        var filterOptions = AppHandler.generateFilterDataV2(keyMapping, currentAppData, metaData, dbViewData, filterSelectedValues, "name");
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
            if ($S.isString(finalMetaData.dateSelect) && finalMetaData.dateSelect.length > 0) {
                dateSelect = finalMetaData.dateSelect;
            } else {
                dateSelect = Config.defaultDateSelect;
            }
        }
        DataHandler.setData("date-select", dateSelect);
        this.findCurrentList3Id();
        TemplateHandler.SetUserRealtedData();
    }
});
DataHandlerV2.extend({
    _getUploadFileInfo: function(pageName, uploadedFileData) {
        var loginUsername = AppHandler.GetUserData("username", "");
        if ($S.isArray(uploadedFileData)) {
            for(var i=0; i<uploadedFileData.length; i++) {
                if (!$S.isObject(uploadedFileData[i])) {
                    continue;
                }
                uploadedFileData[i]["file_details"] = DisplayUploadedFiles.getFileDisplayTemplate(pageName, uploadedFileData[i], loginUsername);
            }
        }
        return uploadedFileData;
    },
    _getLinkRef: function(pageName) {
        var linkRef = DataHandler.getAppData("linkRef");
        if (!$S.isObject(linkRef)) {
            linkRef = {};
        }
        return linkRef["pageName:" + pageName + ":linkRef"];
    },
    _getUpdateSupplyItemLink: function(pageName, pid, entry) {
        var tdFieldText = {"tag": "link", "text": "Update", "href": ""};
        var sid = "";
        if ($S.isObject(entry) && $S.isString(entry.sid)) {
            sid = entry.sid;
        }
        tdFieldText["href"] = DataHandler.getLink(pid, sid, this._getLinkRef(pageName));
        return tdFieldText;
    },
    getProjectData: function(pageName) {
        var currentPId = DataHandler.getPathParamsData("pid");
        var projectTable = DataHandlerV2.getTableDataByAttr(DataHandler.getTableName("projectTable"), "pid", currentPId);
        var response = {"status": "SUCCESS"};
        if (projectTable.length !== 1) {
            response["status"] = "FAILURE";
            response["reason"] = "Invalid Project Id: " + currentPId;
        } else {
            response["pName"] = projectTable[0].pName;
        }
        return response;
    },
    getProjectDataV2: function(pageName) {
        var response = this.getProjectData();
        var currentPId = DataHandler.getPathParamsData("pid");
        var tableName = DataHandler.getTableName("fileTable");
        var uploadedFileData = DataHandlerV2.getTableDataByAttr(tableName, "pid", currentPId);
        response["uploadedFileData"] = this._getUploadFileInfo(pageName, uploadedFileData);
        response["tableName"] = tableName;
        return response;
    },
    getAddItemPageData: function(pageName, sortingFields) {
        var currentPId = DataHandler.getPathParamsData("pid");
        var response = this.getProjectData();
        var tableName = DataHandler.getTableName("pageName:" + pageName + ".materialSupplyItems");
        var supplyItem = DataHandlerV2.getTableDataByAttr(tableName, "pid", currentPId);
        if ($S.isArray(supplyItem)) {
            for(var i=0; i<supplyItem.length; i++) {
                if (!$S.isObject(supplyItem[i])) {
                    continue;
                }
                supplyItem[i].update_item_link = this._getUpdateSupplyItemLink(pageName, currentPId, supplyItem[i]);
            }
        }
        response["supplyItem"] = supplyItem;
        response["tableName"] = tableName;
        return response;
    },
    getItemUpdatePageData: function(pageName, sortingFields) {
        var projectId = DataHandler.getPathParamsData("pid");
        var secondaryItemId = DataHandler.getPathParamsData("sid");
        var response = this.getProjectData();
        if (response.status !== "SUCCESS") {
            return response;
        }
        var tableName = DataHandler.getTableName("pageName:" + pageName + ".materialSupplyItems");
        var secondaryItemList = DataHandlerV2.getTableDataByAttr(tableName, "sid", secondaryItemId);
        if (secondaryItemList.length !== 1 || !$S.isObject(secondaryItemList[0])) {
            response["status"] = "FAILURE";
            response["reason"] = "Invalid Item Id: " + secondaryItemId;
            return response;
        } else if (secondaryItemList[0].pid !== projectId) {
            response["status"] = "FAILURE";
            response["reason"] = "projectId: " + projectId + ", and Item Id: " + secondaryItemId + " mismatch";
            return response;
        }
        tableName = DataHandler.getTableName("pageName:" + pageName + ".materialSupplyStatus");
        var itemName = this.getDisplayName(DataHandler.getTableName("pageName:" + pageName + ".materialSupplyItems"), "sid", secondaryItemId, "supply_item_name");
        var updatedItemData = DataHandlerV2.getTableDataByAttr(tableName, "sid", secondaryItemId);
        response["supplyStatus"] = updatedItemData;
        response["supplyItemName"] = itemName;
        response["tableName"] = tableName;
        return response;
    },
    handlePageByPageId: function(pageId, dbViewData) {
        var i, tableData, loginUsername, fileTableName;
        switch(pageId) {
            case "displayUploadedFiles":
                loginUsername = AppHandler.GetUserData("username", "");
                fileTableName = DataHandler.getTableName("fileTable");
                if ($S.isObject(dbViewData[fileTableName]) && $S.isArray(dbViewData[fileTableName]["tableData"])) {
                    tableData = dbViewData[fileTableName]["tableData"];
                    for(i=0; i<tableData.length; i++) {
                        if (!$S.isObject(tableData[i])) {
                            continue;
                        }
                        tableData[i]["file_details"] = DisplayUploadedFiles.getFileDisplayTemplate(null, tableData[i], loginUsername);
                    }
                }
            break;
            default:
            break;
        }
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
                        urls[j] = Config.baseApi + el + "&requestId=" + Config.requestId + "&temp_file_name=" + i + j;
                    } else {
                        urls[j] = Config.baseApi + el + "?requestId=" + Config.requestId + "&temp_file_name=" + i + j;
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
    _removeDeletedItem: function(dbViewData) {
        if (!$S.isObject(dbViewData)) {
            return;
        }
        var deleteTableName = DataHandler.getTableName("deleteTable");
        var deleteTableData = [], deletedIds = [], i;
        if ($S.isObject(dbViewData[deleteTableName])) {
            if ($S.isArray(dbViewData[deleteTableName].tableData)) {
                deleteTableData = dbViewData[deleteTableName].tableData;
            }
        }
        for(i=0; i<deleteTableData.length; i++) {
            if ($S.isStringV2(deleteTableData[i].deleteId)) {
                deletedIds.push(deleteTableData[i].deleteId);
            }
        }
        DBViewDataHandler.RemoveDeletedItem(dbViewData, deletedIds, deleteTableName, "unique_id");
    },
    _handleDefaultSorting: function(tableData) {
        this._removeDeletedItem(tableData);
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
DataHandlerV2.extend({
    _getDynamicEnabledData: function() {
        var dynamicEnabling = DataHandler.getAppData("dynamicEnabling");
        if (!$S.isObject(dynamicEnabling)) {
            return true;
        }
        var dynamicEnablingData;
        for(var key in dynamicEnabling) {
            if (AppHandler.GetUserData(key)) {
                dynamicEnablingData = dynamicEnabling[key];
                break;
            }
        }
        return dynamicEnablingData;
    },
    getEnabledPageId: function() {
        var dynamicEnablingData = this._getDynamicEnabledData();
        var enabledPageId = [];
        if ($S.isObject(dynamicEnablingData)) {
            enabledPageId = dynamicEnablingData["enabledPageId"];
        }
        return enabledPageId;
    },
    isDisabled: function(type, value) {
        var dynamicEnablingData = this._getDynamicEnabledData();
        var enabledPages = [], enabledPageId = [], enabledForms = [];
        if ($S.isObject(dynamicEnablingData)) {
            if ($S.isArray(dynamicEnablingData["enabledPages"])) {
                enabledPages = dynamicEnablingData["enabledPages"];
            }
            if ($S.isArray(dynamicEnablingData["enabledPageId"])) {
                enabledPageId = dynamicEnablingData["enabledPageId"];
            }
            if ($S.isArray(dynamicEnablingData["enabledForms"])) {
                enabledForms = dynamicEnablingData["enabledForms"];
            }
        }
        if (type === "pageName") {
            return enabledPages.indexOf(value) < 0;
        }
        if (type === "pageId") {
            return enabledPageId.indexOf(value) < 0;
        }
        if (type === "form") {
            return enabledForms.indexOf(value) < 0;
        }
        return true;
    }
});
})($S);

export default DataHandlerV2;
