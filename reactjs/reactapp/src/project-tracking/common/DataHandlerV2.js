import $S from "../../interface/stack.js";
import Config from "./Config";
import DataHandler from "./DataHandler";
// import TemplateHandler from "./template/TemplateHandler";
import DisplayPage from "./pages/DisplayPage";
import DisplayUploadedFiles from "./pages/DisplayUploadedFiles";

// import Api from "../../common/Api";
import AppHandler from "../../common/app/common/AppHandler";
import CommonDataHandler from "../../common/app/common/CommonDataHandler";

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
        var currentPId = DataHandler.getPathParamsData("pid");
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
        var metaData = CommonDataHandler.getData("metaData", {});
        var filterSelectedValues = DataHandler.getData("filterValues", {});
        var pageId = DataHandler.getPathParamsData("pageId", "");
        var keyMapping = DataHandler.getAppData("pageId:" + pageId + ".filterKeyMapping", {});
        var filterOptions = AppHandler.generateFilterDataV2(keyMapping, currentAppData, metaData, dbViewData, filterSelectedValues, "name");
        DataHandler.setData("filterOptions", filterOptions);
        return dbViewData;
    },
    generateFilterOptionAndApplyFilter: function(pageName, tableData) {
        var currentAppData = DataHandler.getCurrentAppData({});
        var metaData = CommonDataHandler.getData("metaData", {});
        var filterSelectedValues = DataHandler.getData("filterValues", {});
        var pageRef = this.getPageRefByPageName(pageName);
        var keyMapping = DataHandler.getAppData("pageName:" + pageRef + ".filterKeyMapping", {});
        var filterOptions = AppHandler.generateFilterDataV2(keyMapping, currentAppData, metaData, tableData, filterSelectedValues, "name");
        DataHandler.setData("filterOptions", filterOptions);
        var result = AppHandler.getFilteredData(currentAppData, metaData, tableData, filterOptions, "name");
        return result;
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
    // handleMetaDataLoad: function(metaDataResponse) {
    //     var finalMetaData = {}, i, tempMetaData, temp;
    //     var appControlMetaData = DataHandler.getData("appControlMetaData", {});
    //     if ($S.isObject(appControlMetaData)) {
    //         finalMetaData = appControlMetaData;
    //     }
    //     if ($S.isArray(metaDataResponse)) {
    //         for (i=0; i<metaDataResponse.length; i++) {
    //             if ($S.isObject(metaDataResponse[i])) {
    //                 tempMetaData = metaDataResponse[i];
    //                 temp = tempMetaData.metaData;
    //                 if ($S.isObject(temp)) {
    //                     temp = Object.keys(temp);
    //                     if (temp.length > 0) {
    //                         tempMetaData = tempMetaData.metaData;
    //                     }
    //                 }
    //                 finalMetaData = Object.assign(finalMetaData, tempMetaData);
    //             }
    //         }
    //     }
    //     DataHandler.setData("metaData", finalMetaData);
    //     var dateSelect = DataHandler.getData("date-select", "");
    //     if (dateSelect === "") {
    //         if ($S.isString(finalMetaData.dateSelect) && finalMetaData.dateSelect.length > 0) {
    //             dateSelect = finalMetaData.dateSelect;
    //         } else {
    //             dateSelect = Config.defaultDateSelect;
    //         }
    //     }
    //     DataHandler.setData("date-select", dateSelect);
    //     this.findCurrentList3Id();
    //     TemplateHandler.SetUserRealtedData();
    // }
});
DataHandlerV2.extend({
    _updateFileInfo: function(pageName, uploadedFileData) {
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
    _updateFormTypeAttr: function(pageName, uploadedFileData) {
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
    // getLinkRef: function(pageName) {
    //     var linkRef = DataHandler.getAppData("linkRef");
    //     if (!$S.isObject(linkRef)) {
    //         linkRef = {};
    //     }
    //     return linkRef["pageName:" + pageName + ":linkRef"];
    // },
    // _getUpdateSupplyItemLink: function(pageName, pid, entry) {
    //     var tdFieldText = {"tag": "link", "text": "Update", "href": ""};
    //     var sid = "";
    //     if ($S.isObject(entry) && $S.isString(entry.sid)) {
    //         sid = entry.sid;
    //     }
    //     tdFieldText["href"] = DataHandler.getLink(pid, sid, this.getLinkRef(pageName));
    //     return tdFieldText;
    // },
    getRowDataByAttr: function(tableName, attr) {
        var response = {"status": "FAILURE"};
        if (!$S.isObject(attr)) {
            response["reason"] = "Invalid attr";
            return response;
        }
        var projectTable = DataHandlerV2.getTableDataByAttrV2(tableName, attr);

        if (!$S.isArray(projectTable) || projectTable.length !== 1) {
            response["reason"] = "Invalid Row";
            for (var key in attr) {
                response["reason"] += " "+ key + " : " + attr[key];
            }
        } else {
            response["status"] = "SUCCESS";
            response["rowData"] = projectTable[0];
        }
        return response;
    },
    getProjectDataV2: function(pageName) {
        var tableName = DataHandler.getTableName("projectTable");
        var pid = DataHandler.getPathParamsData("pid");
        var response = this.getRowDataByAttr(tableName, {"pid": pid});
        var finalResponse = {"status": "SUCCESS"};
        if (response.status === "SUCCESS") {
            finalResponse["pidRow"] = response["rowData"];
        } else {
            finalResponse = response;
        }
        return finalResponse;
    },
    getProjectDataV3: function(pageName) {
        var tableName = DataHandler.getTableName("projectTable");
        var formName = this.getFormNameByPageName("projectId");
        var formType = this.getFormTypeByPageName("projectId");
        var pid = DataHandler.getPathParamsData("pid");
        var response = this.getRowDataByAttr(tableName, {"pid": pid});
        var finalResponse = {"status": "SUCCESS"};
        if ($S.isStringV2(formType)) {
            formName += "." + formType;
        }
        if (response.status === "SUCCESS") {
            var id1 = CommonDataHandler.getPathParamsData("id1", "");
            tableName = DataHandler.getTableName(formName + ".tableName");
            var response2 = this.getRowDataByAttr(tableName, {"pid": pid, "unique_id": id1});
            if (response.status === "SUCCESS") {
                finalResponse["pidRow"] = response["rowData"];
                finalResponse["id1Row"] = response2["rowData"];
            } else {
                finalResponse = response2;
            }
        } else {
            finalResponse = response;
        }
        return finalResponse;
    },
    getRenderTableDataV1: function(pageName, tableName) {
        var pid = DataHandler.getPathParamsData("pid");
        var uploadedFileData = DataHandlerV2.getTableDataByAttr(tableName, "pid", pid);
        var uploadedFileTable = this._updateFileInfo(pageName, uploadedFileData);
        return uploadedFileTable;
    },
    getRenderTableDataV2: function(pageName, tableName) {
        var pid = DataHandler.getPathParamsData("pid");
        var uploadedFileData = DataHandlerV2.getTableDataByAttr(tableName, "pid", pid);
        var uploadedFileTable = this._updateFormTypeAttr(pageName, uploadedFileData);
        return uploadedFileTable;
    },
    getRenderTableDataV3: function(pageName, tableName) {
        var pid = DataHandler.getPathParamsData("pid", "");
        var id1 = DataHandler.getPathParamsData("id1", "");
        var uploadedFileData = DataHandlerV2.getTableDataByAttrV2(tableName, {"pid": pid, "id1": id1});
        return uploadedFileData;
    },
    getFormTypeByPageName: function(pageName) {
        var formType = "";
        if (pageName === "projectId") {
            var pidData = this.getProjectDataV2(pageName);
            if (pidData.status === "SUCCESS") {
                if ($S.isObject(pidData["pidRow"]) && $S.isStringV2(pidData["pidRow"]["form_type"])) {
                    formType = pidData["pidRow"]["form_type"];
                }
            }
        } else if (pageName === "id1Page") {
            var id1PageData = this.getProjectDataV3(pageName);
            if (id1PageData.status === "SUCCESS") {
                if ($S.isObject(id1PageData["id1Row"]) && $S.isStringV2(id1PageData["id1Row"]["form_type"])) {
                    formType = id1PageData["id1Row"]["form_type"];
                }
            }
        }
        return formType;
    },
    getPageRefByPageName: function(pageName) {
        var formType = this.getFormTypeByPageName(pageName);
        var pageRef = pageName;
        if ($S.isStringV2(formType)) {
            pageRef += "." + formType;
        }
        return pageRef;
    },
    getFormNameByPageName: function(pageName) {
        var formType = this.getFormTypeByPageName(pageName);
        var formNameKey = pageName;
        if ($S.isStringV2(formType)) {
            formNameKey += "." + formType;
        }
        return DataHandler.getAppData(formNameKey + ".formName", "");
    },
    getResultPatternNameByPageName: function(pageName) {
        var formType = this.getFormTypeByPageName(pageName);
        var formNameKey = pageName;
        if ($S.isStringV2(formType)) {
            formNameKey += "." + formType;
        }
        return "pageName:" + formNameKey + ".resultPattern";
    },
    // getRenderTableDataV2: function(pageName, tableName) {
    //     var pid = DataHandler.getPathParamsData("pid");
    //     var id1 = DataHandler.getPathParamsData("id1");
    //     var tableName = DataHandler.getTableName(tableName, "");
    //     var tableData = DataHandlerV2.getTableDataByAttrV2(tableName, {"pid": pid, "id1": id1});
    //     return tableData;
    // },
    // getAddItemPageData: function(pageName, sortingFields) {
    //     var currentPId = DataHandler.getPathParamsData("pid");
    //     var response = this.getProjectData();
    //     var tableName = DataHandler.getTableName("pageName:" + pageName + ".materialSupplyItems");
    //     var supplyItem = DataHandlerV2.getTableDataByAttr(tableName, "pid", currentPId);
    //     if ($S.isArray(supplyItem)) {
    //         for(var i=0; i<supplyItem.length; i++) {
    //             if (!$S.isObject(supplyItem[i])) {
    //                 continue;
    //             }
    //             supplyItem[i].update_item_link = this._getUpdateSupplyItemLink(pageName, currentPId, supplyItem[i]);
    //         }
    //     }
    //     response["supplyItem"] = supplyItem;
    //     response["tableName"] = tableName;
    //     return response;
    // },
    // getItemUpdatePageData: function(pageName, sortingFields) {
    //     var currentPId = DataHandler.getPathParamsData("pid");
    //     var secondaryItemId = DataHandler.getPathParamsData("sid");
    //     var response = this.getProjectData();
    //     if (response.status !== "SUCCESS") {
    //         return response;
    //     }
    //     var tableName = DataHandler.getTableName("pageName:" + pageName + ".materialSupplyItems");
    //     var secondaryItemList = DataHandlerV2.getTableDataByAttr(tableName, "sid", secondaryItemId);
    //     if (secondaryItemList.length !== 1 || !$S.isObject(secondaryItemList[0])) {
    //         response["status"] = "FAILURE";
    //         response["reason"] = "Invalid Item Id: " + secondaryItemId;
    //         return response;
    //     } else if (secondaryItemList[0].pid !== currentPId) {
    //         response["status"] = "FAILURE";
    //         response["reason"] = "projectId: " + currentPId + ", and Item Id: " + secondaryItemId + " mismatch";
    //         return response;
    //     }
    //     tableName = DataHandler.getTableName("pageName:" + pageName + ".materialSupplyStatus");
    //     var itemName = this.getDisplayName(DataHandler.getTableName("pageName:" + pageName + ".materialSupplyItems"), "sid", secondaryItemId, "supply_item_name");
    //     var updatedItemData = DataHandlerV2.getTableDataByAttr(tableName, "sid", secondaryItemId);
    //     response["supplyStatus"] = updatedItemData;
    //     response["supplyItemName"] = itemName;
    //     response["tableName"] = tableName;
    //     return response;
    // },
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
    },
    handlePageByViewPageName: function(pageName, viewPageName, dbViewData) {
        if (!$S.isObject(dbViewData)) {
            dbViewData = {};
        }
        var i, fileInfoTableName, loginUsername, fileTableName, filepath;
        var fileInfoData, tableData;
        var tempData = {};
        switch(viewPageName) {
            case "manageFiles":
                loginUsername = AppHandler.GetUserData("username", "");
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
                            fileInfoData[i]["file_details"] = DisplayUploadedFiles.getFileDisplayTemplateV2(pageName, filepath, loginUsername);
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
        var i, fileInfoTableName, loginUsername;
        switch(viewPageName) {
            case "manageFiles":
                fileInfoTableName = DataHandler.getTableName("pageName:pageView:fileInfoTable");
                loginUsername = AppHandler.GetUserData("username", "");
                if ($S.isStringV2(fileInfoTableName)) {
                    if ($S.isArray(finalTable)) {
                        for(i=0; i<finalTable.length; i++) {
                            if ($S.isObject(finalTable[i])) {
                                if ($S.isObject(finalTable[i][fileInfoTableName])) {
                                    finalTable[i][fileInfoTableName]["available_on"] = DisplayPage.getFileAvailableProjects(finalTable[i], loginUsername);
                                    finalTable[i][fileInfoTableName]["add_projects"] = DisplayPage.getAddProjectForm(finalTable[i]);
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
        var attr = {};
        attr[attrName] = attrValue;
        return this.getTableDataByAttrV2(tableName, attr);
    },
    getTableDataByAttrV2: function(tableName, attr) {
        var tableData = this.getTableData(tableName);
        if (!$S.isArray(tableData) || !$S.isObject(attr)) {
            return [];
        }
        var result = $S.searchItems(null, tableData, false, false, "i",
            function(searchingPattern, el, i, arr) {
                if (!$S.isObject(el)) {
                    return false;
                }
                for (var key in attr) {
                    if (el[key] !== attr[key]) {
                        return false;
                    }
                }
                return true;
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
    getEnabledViewPageName: function() {
        var dynamicEnablingData = this._getDynamicEnabledData();
        var enabledViewPage = [];
        if ($S.isObject(dynamicEnablingData)) {
            enabledViewPage = dynamicEnablingData["enabledViewPage"];
        }
        return enabledViewPage;
    },
    isDisabled: function(type, value) {
        var dynamicEnablingData = this._getDynamicEnabledData();
        var enabledPages = [], enabledPageId = [], enabledForms = [], enabledViewPage = [];
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
            if ($S.isArray(dynamicEnablingData["enabledViewPage"])) {
                enabledViewPage = dynamicEnablingData["enabledViewPage"];
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
        if (type === "viewPage") {
            return enabledViewPage.indexOf(value) < 0;
        }
        return true;
    },
    isFilterEnabled: function(pageName, pageId) {
        if ([Config.projectId].indexOf(pageName) >= 0) {
            return true;
        }
        if ([Config.displayPage].indexOf(pageName) >= 0) {
            if (!this.isDisabled(pageId)) {
                return true;
            }
        }
        return false;
    }
});
})($S);

export default DataHandlerV2;
