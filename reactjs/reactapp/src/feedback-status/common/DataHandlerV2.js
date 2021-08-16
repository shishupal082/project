import $S from "../../interface/stack.js";
import Config from "./Config";
import DataHandler from "./DataHandler";
// import TemplateHandler from "./template/TemplateHandler";
// import DisplayPage from "./pages/DisplayPage";
// import DisplayUploadedFiles from "./pages/DisplayUploadedFiles";

// import Api from "../../common/Api";
import AppHandler from "../../common/app/common/AppHandler";
import CommonDataHandler from "../../common/app/common/CommonDataHandler";
// import DBViewDataHandler from "../../common/app/common/DBViewDataHandler";

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
    getList2Data: function(pageName) {
        if ([Config.updateSupplyStatus, Config.updateContingencyStatus, Config.updateWorkStatus].indexOf(pageName) < 0) {
            return null;
        }
        if (this.isDisabled("pageName", pageName)) {
            return null;
        }
        var list2Data = [];
        var currentPId = CommonDataHandler.getPathParamsData("pid");
        var tableName = DataHandler.getTableName("pageName:" + pageName + ".materialSupplyItems");
        var supplyItem = DataHandlerV2.getTableDataByAttr(tableName, "pid", currentPId);
        if ($S.isArray(supplyItem)) {
            for(var i=0; i<supplyItem.length; i++) {
                if (!$S.isObject(supplyItem[i])) {
                    continue;
                }
                list2Data.push({"name": supplyItem[i]["sid"], "toText": supplyItem[i]["supply_item_name"]})
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
        var pageId = CommonDataHandler.getPathParamsData("pageId", "");
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
        var pageId = CommonDataHandler.getPathParamsData("pageId", "");
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
        // TemplateHandler.SetUserRealtedData();
    }
});
DataHandlerV2.extend({
    _getUploadFileInfo: function(pageName, uploadedFileData) {
        // var loginUsername = AppHandler.GetUserData("username", "");
        if ($S.isArray(uploadedFileData)) {
            for(var i=0; i<uploadedFileData.length; i++) {
                if (!$S.isObject(uploadedFileData[i])) {
                    continue;
                }
                // uploadedFileData[i]["file_details"] = DisplayUploadedFiles.getFileDisplayTemplate(pageName, uploadedFileData[i], loginUsername);
            }
        }
        return uploadedFileData;
    },
    getLinkRef: function(pageName) {
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
        tdFieldText["href"] = DataHandler.getLink(pid, sid, this.getLinkRef(pageName));
        return tdFieldText;
    },
    getProjectData: function(pageName) {
        var currentPId = CommonDataHandler.getPathParamsData("pid");
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
        var currentPId = CommonDataHandler.getPathParamsData("pid");
        var tableName = DataHandler.getTableName("fileTable");
        var uploadedFileData = DataHandlerV2.getTableDataByAttr(tableName, "pid", currentPId);
        response["uploadedFileData"] = this._getUploadFileInfo(pageName, uploadedFileData);
        response["tableName"] = tableName;
        return response;
    },
    getAddItemPageData: function(pageName, sortingFields) {
        var currentPId = CommonDataHandler.getPathParamsData("pid");
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
        var currentPId = CommonDataHandler.getPathParamsData("pid");
        var secondaryItemId = CommonDataHandler.getPathParamsData("sid");
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
        } else if (secondaryItemList[0].pid !== currentPId) {
            response["status"] = "FAILURE";
            response["reason"] = "projectId: " + currentPId + ", and Item Id: " + secondaryItemId + " mismatch";
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
        var i, tableData, fileTableName;
        switch(pageId) {
            case "displayUploadedFiles":
                // loginUsername = AppHandler.GetUserData("username", "");
                fileTableName = DataHandler.getTableName("fileTable");
                if ($S.isObject(dbViewData[fileTableName]) && $S.isArray(dbViewData[fileTableName]["tableData"])) {
                    tableData = dbViewData[fileTableName]["tableData"];
                    for(i=0; i<tableData.length; i++) {
                        if (!$S.isObject(tableData[i])) {
                            continue;
                        }
                        // tableData[i]["file_details"] = DisplayUploadedFiles.getFileDisplayTemplate(null, tableData[i], loginUsername);
                    }
                }
            break;
            default:
            break;
        }
    },
    handlePageByViewPageName: function(pageName, viewPageName, dbViewData) {
        if (!$S.isObject(dbViewData)) {
            dbViewData = {};
        }
        var i, fileInfoTableName, fileTableName, filepath;
        var fileInfoData, tableData;
        var tempData = {};
        switch(viewPageName) {
            case "manageFiles":
                // loginUsername = AppHandler.GetUserData("username", "");
                fileTableName = DataHandler.getTableName("fileTable");
                fileInfoData = DataHandler.getData("filesInfoData");
                fileInfoTableName = DataHandler.getTableName("pageName:pageView:fileInfoTable");
                if ($S.isObject(dbViewData[fileTableName]) && $S.isArray(dbViewData[fileTableName]["tableData"])) {
                    tableData = dbViewData[fileTableName]["tableData"];
                    for(i=0; i<tableData.length; i++) {
                        if (!$S.isObject(tableData[i])) {
                            continue;
                        }
                        if (tableData[i]["table_name"] === fileTableName) {
                            tableData[i]["pName"] = this.getDisplayName(DataHandler.getTableName("projectTable"), "pid", tableData[i]["pid"], "pName")
                            if ($S.isArray(tempData[tableData[i]["filename"]])) {
                                tempData[tableData[i]["filename"]].push(tableData[i]);
                            } else {
                                tempData[tableData[i]["filename"]] = [tableData[i]];
                            }
                        }
                    }
                }
                if ($S.isStringV2(fileInfoTableName)) {
                    dbViewData[fileInfoTableName] = {"tableData": []};
                    if ($S.isArray(fileInfoData)) {
                        for(i=0; i<fileInfoData.length; i++) {
                            if (!$S.isObject(fileInfoData[i])) {
                                continue;
                            }
                            filepath = fileInfoData[i].filepath;
                            fileInfoData[i].table_name = fileInfoTableName;
                            // fileInfoData[i]["file_details"] = DisplayUploadedFiles.getFileDisplayTemplateV2(pageName, filepath, loginUsername);
                            if ($S.isArray(tempData[filepath])) {
                                fileInfoData[i].relatedProjectsFiles = tempData[filepath];
                            }
                            dbViewData[fileInfoTableName]["tableData"].push(fileInfoData[i]);
                        }
                    }
                }
            break;
            default:
            break;
        }
    },
    handlePageByViewPageNameV2: function(pageName, viewPageName, finalTable) {
        if (!$S.isArray(finalTable)) {
            finalTable = [];
        }
        var i, fileInfoTableName;
        switch(viewPageName) {
            case "manageFiles":
                fileInfoTableName = DataHandler.getTableName("pageName:pageView:fileInfoTable");
                // loginUsername = AppHandler.GetUserData("username", "");
                if ($S.isStringV2(fileInfoTableName)) {
                    if ($S.isArray(finalTable)) {
                        for(i=0; i<finalTable.length; i++) {
                            if ($S.isObject(finalTable[i])) {
                                if ($S.isObject(finalTable[i][fileInfoTableName])) {
                                    // finalTable[i][fileInfoTableName]["available_on"] = DisplayPage.getFileAvailableProjects(finalTable[i], loginUsername);
                                    // finalTable[i][fileInfoTableName]["add_projects"] = DisplayPage.getAddProjectForm(finalTable[i]);
                                }
                            }
                        }
                    }
                }
            break;
            default:
            break;
        }
    }
});

DataHandlerV2.extend({
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
    }
});
DataHandlerV2.extend({
    _getAllDynamicEnabledData: function() {
        var dynamicEnabling = DataHandler.getAppData("dynamicEnabling");
        if (!$S.isObject(dynamicEnabling)) {
            return {};
        }
        return dynamicEnabling;
    },
    getEnabledPageId: function() {
        var dynamicEnablingData = this._getAllDynamicEnabledData();
        return CommonDataHandler.getEnabledPageId(dynamicEnablingData);
    },
    getEnabledViewPageName: function() {
        var dynamicEnablingData = this._getAllDynamicEnabledData();
        return CommonDataHandler.getEnabledViewPageName(dynamicEnablingData);
    },
    isEnabled: function(type, value) {
        var dynamicEnablingData = this._getAllDynamicEnabledData();
        return CommonDataHandler.isEnabled(dynamicEnablingData, type, value);
    }
});
})($S);

export default DataHandlerV2;
