import $S from "../../interface/stack.js";
import Config from "./Config";
import DataHandler from "./DataHandler";
// import TemplateHandler from "./template/TemplateHandler";
import DisplayPage from "./pages/DisplayPage";
import DisplayUploadedFiles from "./pages/DisplayUploadedFiles";

// import Api from "../../common/Api";
import AppHandler from "../../common/app/common/AppHandler";
import CommonDataHandler from "../../common/app/common/CommonDataHandler";
import FormHandler from "./forms/FormHandler";

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
    getList3Data: function() {
        var pageName = DataHandler.getData("pageName", "");
        var pageId = DataHandler.getPathParamsData("pageId", "");
        var viewPageName = DataHandler.getPathParamsData("viewPageName", "");
        var key = "";
        if (Config.displayPage === pageName) {
            key = "pageId:" + pageId;
        } else if (Config.viewPage === pageName) {
            key = "viewPageName:" + viewPageName;
        }
        if (!$S.isStringV2(key)) {
            return [];
        }
        key += ".list3DataKey";
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
    generateFilterOptions: function(pageName, dbViewData, filterKeyMapping) {
        var currentAppData = DataHandler.getCurrentAppData();
        var metaData = CommonDataHandler.getData("metaData", {});
        var filterSelectedValues = DataHandler.getData("filterValues", {});
        var filterOptions = AppHandler.generateFilterDataV2(filterKeyMapping, currentAppData, metaData, dbViewData, filterSelectedValues, "name");
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
    }
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
    getRowDataByAttr: function(tableName, attr) {
        var response = {"status": "FAILURE"};
        if (!$S.isObject(attr)) {
            response["reason"] = "Invalid attr";
            return response;
        }
        var projectTable = DataHandlerV2.getTableDataByAttrV2(tableName, attr);

        if (!$S.isArray(projectTable) || projectTable.length !== 1) {
            response["reason"] = "Invalid row, ";
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
            var id1 = DataHandler.getPathParamsData("id1", "");
            tableName = DataHandler.getTableName(formName + ".tableName");
            var response2 = this.getRowDataByAttr(tableName, {"pid": pid, "unique_id": id1});
            if (response2.status === "SUCCESS") {
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
    _getFileTableEquivalentName: function() {
        var requiredTableData = [];
        var fileTableName = DataHandler.getTableName("fileTable");
        var linkTableName = DataHandler.getTableName("projectLink");
        var commentTableName = DataHandler.getTableName("projectComment");
        if ($S.isStringV2(fileTableName)) {
            requiredTableData.push(fileTableName);
        }
        if ($S.isStringV2(linkTableName)) {
            requiredTableData.push(linkTableName);
        }
        if ($S.isStringV2(commentTableName)) {
            requiredTableData.push(commentTableName);
        }
        return requiredTableData;
    },
    getRenderTableDataV1: function(pageName) {
        var pid = DataHandler.getPathParamsData("pid");
        var requiredTableData = this._getFileTableEquivalentName();
        var uploadedFileData = [];
        for (var i=0; i<requiredTableData.length; i++) {
            uploadedFileData = uploadedFileData.concat(DataHandlerV2.getTableDataByAttr(requiredTableData[i], "pid", pid));
        }
        var uploadedFileTable = $S.sortResult(uploadedFileData, "descending", "entryTime", null, "");
        uploadedFileTable = this._updateFileInfo(pageName, uploadedFileData);
        return uploadedFileTable;
    },
    getRenderTableDataV1_1: function(pageName) {
        var requiredTableData = this._getFileTableEquivalentName();
        var uploadedFileData = [];
        for (var i=0; i<requiredTableData.length; i++) {
            uploadedFileData = uploadedFileData.concat(DataHandlerV2.getTableData(requiredTableData[i]));
        }
        var uploadedFileTable = $S.sortResult(uploadedFileData, "descending", "entryTime", null, "");
        uploadedFileTable = this._updateFileInfo(pageName, uploadedFileData);
        return uploadedFileTable;
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
    getRowDataParamByFormType: function(rowData, param) {
        var rowDataParam = "";
        if ($S.isObject(rowData) && $S.isStringV2(rowData["form_type"]) && $S.isStringV2(param)) {
            rowDataParam = rowData["form_type"] + "." + param;
        }
        return rowDataParam;
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
    handlePageByPageId: function(pageName, pageId, finalTable) {
        var i, loginUsername, fileTableName, tempData, tempData2;
        var fileInfoData, fileInfoTableName, projectTable;
        var result = [];
        var addedFilePid = [];
        switch(pageId) {
            case "displayUploadedFiles":
                loginUsername = AppHandler.GetUserData("username", "");
                fileTableName = DataHandler.getTableName("fileTable");
                if ($S.isArray(finalTable)) {
                    for (i=0; i < finalTable.length; i++) {
                        if (!$S.isObject(finalTable[i])) {
                            continue;
                        }
                        finalTable[i]["file_details"] = DisplayUploadedFiles.getFileDisplayTemplate(null, finalTable[i], loginUsername);
                        tempData = {};
                        tempData[fileTableName] = finalTable[i];
                        result.push(tempData);
                    }
                }
            break;
            case "manageFiles":
                loginUsername = AppHandler.GetUserData("username", "");
                fileTableName = DataHandler.getTableName("fileTable");
                fileInfoData = DataHandler.getData("filesInfoData");
                fileInfoTableName = DataHandler.getTableName("pageName:displayPage.fileInfoTable");
                projectTable = DataHandlerV2.getTableData(DataHandler.getTableName("projectTable"));
                if ($S.isStringV2(fileInfoTableName)) {
                    if ($S.isArray(fileInfoData)) {
                        for(i=0; i<fileInfoData.length; i++) {
                            if (!$S.isObject(fileInfoData[i])) {
                                continue;
                            }
                            tempData = {};
                            fileInfoData[i]["file_details"] = DisplayUploadedFiles.getFileDisplayTemplateV2(pageName, fileInfoData[i].filepath, loginUsername);
                            fileInfoData[i]["available_on"] = DisplayPage.getFileAvailableProjects(fileInfoData[i], finalTable, loginUsername, addedFilePid);
                            fileInfoData[i]["add_projects"] = FormHandler.getAddProjectFilesTemplate(pageName, fileInfoData[i], projectTable);
                            tempData[fileInfoTableName] = fileInfoData[i];
                            result.push(tempData);
                        }
                    }
                }
                if ($S.isStringV2(fileInfoTableName) && $S.isArray(finalTable) && $S.isArray(addedFilePid)) {
                    for (i=0; i < finalTable.length; i++) {
                        if (!$S.isObject(finalTable[i]) || !$S.isStringV2(finalTable[i].unique_id)) {
                            continue;
                        }
                        if (addedFilePid.indexOf(finalTable[i].unique_id) >= 0) {
                            continue;
                        }
                        tempData = {};
                        tempData2 = finalTable[i];
                        tempData2["available_on"] = DisplayPage.getFileAvailableProjectsV2(finalTable[i], loginUsername, addedFilePid);
                        tempData[fileInfoTableName] = tempData2;
                        result.push(tempData);
                    }
                }
            break;
            default:
            break;
        }
        return result;
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
    getTableDataV2: function(pageName, tableName) {
        var pid = DataHandler.getPathParamsData("pid", "");
        if (!$S.isStringV2(pid)) {
            return [];
        }
        var tableData = DataHandlerV2.getTableDataByAttrV2(tableName, {"pid": pid});
        return tableData;
    },
    getTableDataV3: function(pageName, tableName, id1) {
        var pid = DataHandler.getPathParamsData("pid", "");
        if (!$S.isStringV2(pid) || !$S.isStringV2(id1)) {
            return [];
        }
        var tableData = DataHandlerV2.getTableDataByAttrV2(tableName, {"pid": pid, "id1": id1});
        return tableData;
    },
    getTableDataV4: function(pageName, tableName) {
        var id1 = DataHandler.getPathParamsData("id1", "");
        var tableData = this.getTableDataV3(pageName, tableName, id1);
        return tableData;
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
        if (!$S.isStringV2(value)) {
            return true;
        }
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
    isFilterEnabled: function(pageName, pageId, viewPageName) {
        var status = false;
        if ([Config.projectId].indexOf(pageName) >= 0) {
            status = true;
        } else if ([Config.displayPage].indexOf(pageName) >= 0) {
            if (!this.isDisabled("pageId", pageId)) {
                status = true;
            }
        } else if ([Config.viewPage].indexOf(pageName) >= 0) {
            if (!this.isDisabled("viewPage", viewPageName)) {
                status = true;
            }
        }
        if (status) {
            var filterOptions = DataHandler.getData("filterOptions", []);
            if (!$S.isArray(filterOptions) || filterOptions.length === 0) {
                status = false;
            }
        }
        return status;
    },
    isDateSelectionEnable: function(pageName, pageId, viewPageName) {
        var status, dateParameterField;
        if ([Config.home, Config.projectId, Config.id1Page].indexOf(pageName) < 0) {
            status = false;
        }
        if ([Config.displayPage].indexOf(pageName) >= 0) {
            if (!this.isDisabled("pageId", pageId)) {
                status = true;
                dateParameterField = DataHandler.getAppData("pageId:" + pageId + ".dateParameterField", {});
            }
        }
        if ([Config.viewPage].indexOf(pageName) >= 0) {
            if (!this.isDisabled("viewPage", viewPageName)) {
                status = true;
                dateParameterField = DataHandler.getAppData("viewPageName:" + viewPageName + ".dateParameterField", {});
            }
        }
        if (status && $S.isObjectV2(dateParameterField)) {
            status = true;
        } else {
            status = false;
        }
        return status;
    }
});
})($S);

export default DataHandlerV2;
