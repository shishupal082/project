import $S from "../../../interface/stack.js";
import DataHandler from "../DataHandler";
import DataHandlerV2 from "../DataHandlerV2";
import TemplateHandler from "../template/TemplateHandler";
// import Config from "../Config";


import Api from "../../../common/Api";
import AppHandler from "../../../common/app/common/AppHandler";
import CommonConfig from "../../../common/app/common/CommonConfig";
import CommonDataHandler from "../../../common/app/common/CommonDataHandler";
import TemplateHelper from "../../../common/TemplateHelper";
// import FormHandler from "../forms/FormHandler";
import DBViewDataHandler from "../../../common/app/common/DBViewDataHandler";


var ScanDir;
var _temp;
(function($S){
// var DT = $S.getDT();

ScanDir = function(arg) {
    return new ScanDir.fn.init(arg);
};
ScanDir.fn = ScanDir.prototype = {
    constructor: ScanDir,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(ScanDir);
ScanDir.extend({
    // _getFinalDbTable: function(dbViewData) {
    //     var finalDbTable = [], temp;
    //     var requiredTableName = "";
    //     if ($S.isArray(dbViewData)) {
    //         for (var i=0; i<dbViewData.length; i++) {
    //             if (!$S.isObject(dbViewData[i])) {
    //                 continue;
    //             }
    //             temp = {};
    //             for (var tableName in dbViewData[i]) {
    //                 if ($S.isObject(dbViewData[i][tableName])) {
    //                     temp = Object.assign(temp, dbViewData[i][tableName]);
    //                 }
    //             }
    //             if (Object.keys(temp).length > 0) {
    //                 finalDbTable.push(temp);
    //             }
    //         }
    //     }
    //     return finalDbTable;
    // },
    getRenderData: function(pageName, pageId, sortingFields) {
        var requiredDataTable = DataHandler.getAppData("pageId:" + pageId + ".requiredDataTable");
        var filterKeyMapping = DataHandler.getAppData("pageId:" + pageId + ".filterKeyMapping");
        var resultPattern = DataHandler.getAppData("pageId:" + pageId + ".resultPattern");
        var resultCriteria = DataHandler.getAppData("pageId:" + pageId + ".resultCriteria");
        var currentAppData = DataHandler.getCurrentAppData();
        var metaData = CommonDataHandler.getData("metaData");
        var fileTableName = DataHandler.getTableName("fileTable");
        var dbViewData = {}, i;
        if ($S.isArray(requiredDataTable)) {
            for (i=0; i<requiredDataTable.length; i++) {
                if ($S.isStringV2(requiredDataTable[i])) {
                    if (pageId === "displayUploadedFiles" && fileTableName === requiredDataTable[i]) {
                        dbViewData[requiredDataTable[i]] = {"tableData": DataHandlerV2.getRenderTableDataV1_1(pageName)};
                    } else {
                        dbViewData[requiredDataTable[i]] = {"tableData": DataHandlerV2.getTableData(requiredDataTable[i])};
                    }
                }
            }
        }
        var finalTable = DBViewDataHandler.GetFinalTableV2(dbViewData, resultCriteria, requiredDataTable);
        dbViewData = DataHandlerV2.handlePageByPageId(pageName, pageId, finalTable);
        finalTable = DBViewDataHandler.ApplyResultPattern(dbViewData, resultPattern);
        // finalTable = this._getFinalDbTable(dbViewData);
        DataHandlerV2.generateFilterOptions(pageName, finalTable, filterKeyMapping);
        var filterOptions = DataHandler.getData("filterOptions");
        finalTable = AppHandler.getFilteredDataV2(filterKeyMapping, currentAppData, metaData, finalTable, filterOptions, "name");
        return finalTable;
    },
    getRenderDataV2: function(pageName, viewPageName, sortingFields) {
        var requiredDataTable = DataHandler.getAppData("viewPageName:" + viewPageName + ".requiredDataTable");
        var filterKeyMapping = DataHandler.getAppData("viewPageName:" + viewPageName + ".filterKeyMapping");
        var resultPattern = DataHandler.getAppData("viewPageName:" + viewPageName + ".resultPattern");
        var resultCriteria = DataHandler.getAppData("viewPageName:" + viewPageName + ".resultCriteria");
        var dbViewData = {}, i;
        if ($S.isArray(requiredDataTable)) {
            for (i=0; i<requiredDataTable.length; i++) {
                if ($S.isStringV2(requiredDataTable[i])) {
                    dbViewData[requiredDataTable[i]] = {"tableData": DataHandlerV2.getTableData(requiredDataTable[i])};
                }
            }
        }
        var finalTable = DBViewDataHandler.GetFinalTable(dbViewData, resultPattern, resultCriteria, null);
        DataHandlerV2.generateFilterOptions(pageName, finalTable, filterKeyMapping);
        return finalTable;
    },
    getRenderDataV3: function(pageName, sortingFields) {
        var requiredDataTable = DataHandler.getAppData("pageName:" + pageName + ".requiredDataTable");
        var filterKeyMapping = DataHandler.getAppData("pageName:" + pageName + ".filterKeyMapping");
        var resultPattern = DataHandler.getAppData("pageName:" + pageName + ".resultPattern");
        var resultCriteria = DataHandler.getAppData("pageName:" + pageName + ".resultCriteria");
        var currentAppData = DataHandler.getCurrentAppData();
        var metaData = CommonDataHandler.getData("metaData");
        var dbViewData = {}, i;
        if ($S.isArray(requiredDataTable)) {
            for (i=0; i<requiredDataTable.length; i++) {
                if ($S.isStringV2(requiredDataTable[i])) {
                    dbViewData[requiredDataTable[i]] = {"tableData": DataHandlerV2.getTableData(requiredDataTable[i])};
                }
            }
        }
        var finalTable = DBViewDataHandler.GetFinalTableV2(dbViewData, resultCriteria, requiredDataTable);
        dbViewData = DataHandlerV2.handlePageByPageName(pageName, finalTable);
        finalTable = DBViewDataHandler.ApplyResultPattern(dbViewData, resultPattern);
        // finalTable = this._getFinalDbTable(dbViewData);
        DataHandlerV2.generateFilterOptions(pageName, finalTable, filterKeyMapping);
        var filterOptions = DataHandler.getData("filterOptions");
        finalTable = AppHandler.getFilteredDataV2(filterKeyMapping, currentAppData, metaData, finalTable, filterOptions, "name");
        return finalTable;
    },
    _generateResult: function(fileInfoDataRow, fileTableRow, loginUsername, index) {
        var result = null;
        var deleteFileTemplate = TemplateHandler.getTemplate("deleteFileTemplate");
        var actionItem;
        var buttonNameRemove = "remove_file.form.button";
        var deleteAllowed = false;
        var fileInfoText;
        if ($S.isObject(fileTableRow)) {
            actionItem = deleteFileTemplate;
            fileInfoText = fileTableRow.subject;
            TemplateHelper.updateTemplateValue(actionItem, {"delete_file.form": fileTableRow.tableUniqueId});
            if (fileTableRow.addedBy === loginUsername) {
                TemplateHelper.removeClassTemplate(actionItem, buttonNameRemove, "disabled");
                TemplateHelper.addClassTemplate(actionItem, buttonNameRemove, "text-danger");
            }
            if ($S.isObject(fileInfoDataRow) && fileInfoDataRow.fileUsername === loginUsername) {
                deleteAllowed = true;
            }
            if (fileInfoDataRow === null) {
                fileInfoText += "--" + fileTableRow.filename;
            }
            result = {"tag": "tr", "deleteAllowed": deleteAllowed, "text": [
                {
                    "tag": "td.b",
                    "text": index
                },
                {
                    "tag": "td",
                    "text": fileInfoText
                },
                {
                    "tag": "td.b",
                    "text": fileTableRow.addedBy
                },
                {
                    "tag": "td",
                    "text": fileTableRow.pName
                },
                {
                    "tag": "td",
                    "text": actionItem
                }
            ]};
        }
        return result;
    },
    getFileAvailableProjects: function(fileInfoDataRow, finalTable, loginUsername, addedFilePid) {
        var result = [], filepath;
        if (!$S.isArray(finalTable) || !$S.isObject(fileInfoDataRow) || !$S.isStringV2(fileInfoDataRow.filepath)) {
            return result;
        }
        if (!$S.isArray(addedFilePid)) {
            addedFilePid = [];
        }
        var fieldHtml = {"tag": "table.tbody", "className": "table-striped table-padded-px-5", "text": []};
        var buttonNameDelete = "delete_file.form.button";
        var fileTableName = DataHandler.getTableName("fileTable");
        filepath = fileInfoDataRow.filepath;
        var index = 1, i;
        for (i=0; i<finalTable.length; i++) {
            if (!$S.isObject(finalTable[i]) && !$S.isObject(finalTable[i][fileTableName])) {
                continue;
            }
            if (filepath === finalTable[i][fileTableName].filename) {
                _temp = this._generateResult(fileInfoDataRow, finalTable[i][fileTableName], loginUsername, index);
                if (_temp === null) {
                    continue;
                }
                addedFilePid.push(finalTable[i][fileTableName].tableUniqueId);
                fieldHtml.text.push(_temp);
                index++;
            }
        }
        if (index > 1) {
            // Need not to check deleteAllowed in getFileAvailableProjectsV2, because fileUsername is null
            if (fieldHtml.text.length === 1 && $S.isObject(fieldHtml.text[0]) && fieldHtml.text[0].deleteAllowed) {
                TemplateHelper.addClassTemplate(fieldHtml.text[0], buttonNameDelete, "text-danger");
                TemplateHelper.removeClassTemplate(fieldHtml.text[0], buttonNameDelete, "disabled");
            }
            result.push(fieldHtml);
        }
        return result;
    },
    getFileAvailableProjectsV2: function(finalTableRow, loginUsername, addedFilePid) {
        var fieldHtml = {"tag": "table.tbody", "className": "table-striped table-padded-px-5", "text": []};
        var result = [];
        if (!$S.isObjectV2(finalTableRow)) {
            return [];
        }

        _temp = this._generateResult(null, finalTableRow, loginUsername, 1);
        if (_temp === null) {
            return [];
        }
        addedFilePid.push(finalTableRow.tableUniqueId);
        fieldHtml.text.push(_temp);
        result.push(fieldHtml);
        return result;
    },
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
                        urls[j] = CommonConfig.baseApi + el + "&requestId=" + CommonConfig.requestId + "&temp_file_name=" + i + j;
                    } else {
                        urls[j] = CommonConfig.baseApi + el + "?requestId=" + CommonConfig.requestId + "&temp_file_name=" + i + j;
                    }
                }
                if (urls.length < 1) {
                    continue;
                }
                temp = {};
                temp.apis = dbDataApis[i].apis;
                temp.dataIndex = dbDataApis[i].dataIndex;
                temp.wordBreak = dbDataApis[i].wordBreak;
                temp.apiName = dbDataApis[i].apiName;
                temp.tableName = dbDataApis[i].tableName;
                temp.singleLineComment = dbDataApis[i].singleLineComment;
                temp.responseType = dbDataApis[i]["responseType"];
                if (temp.responseType === "json") {
                    temp.requestMethod = Api.getAjaxApiCallMethod();
                } else {
                    temp.requestMethod = Api.getAjaxApiCallMethodV2();
                }
                if (!$S.isStringV2(temp.apiName)) {
                    temp.apiName = temp.tableName;
                }
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
    handlePageLoad: function(dbDataApis, dbTableDataIndex, callback) {
        var keys = ["appControlDataLoadStatus", "metaDataLoadStatus"];
        var status = CommonDataHandler.getDataLoadStatusByKey(keys);
        var database;
        if (status === "completed") {
            status = DataHandler.getData("dbViewDataLoadStatus");
            if (status === "not-started") {
                DataHandler.setData("dbViewDataLoadStatus", "in-progress");
                var dbViewData;
                this._loadDBViewData(dbDataApis, function(request) {
                    DataHandler.setData("dbViewDataLoadStatus", "completed");
                    database = AppHandler.GenerateDatabase(request, dbTableDataIndex);
                    dbViewData = DataHandler.getData("dbViewData", {});
                    dbViewData = AppHandler.MergeDatabase(dbViewData, database);
                    DataHandler.setData("dbViewData", dbViewData);
                    $S.callMethod(callback);
                });
            } else {
                $S.callMethod(callback);
            }
        }
    },
    loadScanDirConfigDataApi: function(callback) {
        var scanDirConfigDataApi = DataHandler.getAppData("scanDirConfigDataApi");
        this.handlePageLoad(scanDirConfigDataApi, null, callback);
        // callback();
    }
});
})($S);

export default ScanDir;
