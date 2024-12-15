import $S from "../../../interface/stack.js";
import DataHandler from "../DataHandler";
import DataHandlerV2 from "../DataHandlerV2";
import TemplateHandler from "../template/TemplateHandler";
// import Config from "../Config";


// import Api from "../../../common/Api";
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
    _updateHomeLink: function(request) {
        var rowData;
        var dbViewLink, dbViewLinkSummary;
        var index = DataHandler.getPathParamsData("index", "");
        if ($S.isArray(request)) {
            for(var i=0; i<request.length; i++) {
                if (!$S.isObject(request[i])) {
                    continue;
                }
                if (!$S.isArray(request[i]["response"])) {
                    continue;
                }
                for (var j=0; j<request[i]["response"].length; j++) {
                    if (!$S.isArray(request[i]["response"][j])) {
                        continue;
                    }
                    for (var k=0; k<request[i]["response"][j].length; k++) {
                        rowData = request[i]["response"][j][k];
                        if ($S.isObject(rowData)) {
                            dbViewLink = TemplateHandler.getHomePageLink(index, rowData["id"], "dbview");
                            dbViewLinkSummary = TemplateHandler.getHomePageLink(index, rowData["id"], "dbview_summary");
                            dbViewLink = {"tag": "link", "href": dbViewLink, "text": "View details"};
                            dbViewLinkSummary = {"tag": "link", "href": dbViewLinkSummary, "text": "Summary"};
                            rowData["dbview_link"] = dbViewLink;
                            rowData["dbview_summary_link"] = dbViewLinkSummary;
                        }
                        request[i]["response"][j][k] = rowData;
                    }
                }
            }
        }
    },
    loadDBViewConfigData: function(callback) {
        var scanDirConfigDataApi = DataHandler.getAppData("scanDirConfigDataApi");
        var keys = ["appControlDataLoadStatus", "metaDataLoadStatus"];
        var status = CommonDataHandler.getDataLoadStatusByKey(keys);
        var database;
        var dbTableDataIndex = null;
        var resultPattern = DataHandler.getAppData("resultPattern.home");
        var tableName = "scan_dir_config_data";
        var self = this;
        if (status === "completed") {
            status = DataHandler.getData("dbViewConfigDataLoadStatus");
            if (status === "not-started") {
                DataHandler.setData("dbViewConfigDataLoadStatus", "in-progress");
                var dbViewData;
                CommonDataHandler.LoadDBViewData(scanDirConfigDataApi, function(request) {
                    DataHandler.setData("dbViewConfigDataLoadStatus", "completed");
                    CommonDataHandler.FormateApiResponseInRequest(request);
                    self._updateHomeLink(request);
                    database = AppHandler.GenerateDatabaseV2(request, dbTableDataIndex);
                    dbViewData = DataHandler.getData("dbViewData", {});
                    dbViewData = AppHandler.MergeDatabase(dbViewData, database);
                    DataHandler.setData("dbViewData", dbViewData);
                    dbViewData = DBViewDataHandler.GetFinalTable(dbViewData, resultPattern, null, [tableName]);
                    DataHandler.setData("dbViewConfigDataTable", dbViewData);
                    $S.callMethod(callback);
                });
            } else {
                $S.callMethod(callback);
            }
        }
    },
    _getScanDirDataApi: function(tableName) {
        var url = "/api/read_scan_dir_json?";
        var scanDirId = DataHandler.getPathParamsData("id", "");
        var pathname = DataHandler.getUrlQueryParameter("pathname", "");
        var queryRecursiveParamter = DataHandler.getUrlQueryParameter("recursive", "");
        var appDataRecursive = DataHandler.getAppData("recursive", "");
        var finalRecursive = "false";
        var temp = {"responseType": "json", "apiName": "scanDirApiData"};
        url = url+"scan_dir_id="+scanDirId;
        if ($S.isStringV2(pathname)) {
            url = url + "&pathname=" + pathname;
        }
        if ($S.isStringV2(appDataRecursive)) {
            finalRecursive = appDataRecursive;
        }
        if ($S.isStringV2(queryRecursiveParamter)) {
            finalRecursive = queryRecursiveParamter;
        }
        url = url + "&recursive=" + finalRecursive;
        temp["tableName"] = tableName;
        temp["apis"] = [url];
        return [temp];
    },
    getTableName: function(resultPattern) {
        var tableName = "";
        if ($S.isArray(resultPattern) && resultPattern.length > 0) {
            return resultPattern[0]["tableName"];
        }
        return tableName;
    },
    getQueryParamUrl: function() {
        var recursive = DataHandler.getUrlQueryParameter("recursive", "");
        var pathname = DataHandler.getUrlQueryParameter("pathname", "");
        var queryParam = "";
        if ($S.isStringV2(pathname)) {
            queryParam += "pathname=" + pathname;
        }
        if ($S.isStringV2(recursive)) {
            if ($S.isStringV2(queryParam)) {
                queryParam += "&";
            }
            queryParam += "recursive=" + recursive;
        }
        return queryParam;
    },
    _generateFolderLink: function(folderPath, scanDirPageName) {
        var queryRecursiveParamter = DataHandler.getUrlQueryParameter("recursive", "");
        var folderLink = CommonConfig.basepathname + "/" + DataHandler.getPathParamsData("index", "");
        folderLink += "/id/" + DataHandler.getPathParamsData("id", "") + "/" + scanDirPageName;
        var queryParam = "";
        if ($S.isStringV2(folderPath)) {
            queryParam += "pathname=" + folderPath;
        }
        if ($S.isStringV2(queryRecursiveParamter)) {
            if ($S.isStringV2(queryParam)) {
                queryParam += "&";
            }
            queryParam += "recursive=" + queryRecursiveParamter;
        }
        if ($S.isStringV2(queryParam)) {
            folderLink += "?"+queryParam;
        }
        return folderLink;
    },
    _getFileDetailsLink: function(rowData, scanDirPageName) {
        var fileDetailsLink = {};
        var folderLink;
        if ($S.isObject(rowData)) {
            if (rowData["filepath_type"] === "FILE") {
                fileDetailsLink = {
                    "tag": "a",
                    "isTargetBlank": true,
                    "href": CommonConfig.baseApi + rowData["file_url"],
                    "text": rowData["filepath"]
                };
            } else if (rowData["filepath_type"] === "FOLDER") {
                folderLink = this._generateFolderLink(rowData["filepath"], scanDirPageName);
                fileDetailsLink = {
                    "tag": "div",
                    "className": "list-group",
                    "text": [
                        {
                            "tag": "link",
                            "className": "list-group-item2 list-group-item-action list-group-item-primary",
                            "href": folderLink,
                            "text": rowData["filepath"]
                        }
                    ]
                };
            }
        }
        return fileDetailsLink;
    },
    _updateFileDetails: function(database) {
        var tableData, rowData;
        var scanDirPageName = DataHandler.getPathParamsData("scanDirPage", "");
        if ($S.isObject(database)) {
            for(var tableName in database) {
                if ($S.isObject(database[tableName]) && $S.isArray(database[tableName]["tableData"])) {
                    tableData = database[tableName]["tableData"];
                    for(var i=0; i<tableData.length; i++) {
                        rowData = tableData[i];
                        rowData["file_details"] = this._getFileDetailsLink(rowData, scanDirPageName);
                        tableData[i] = rowData;
                    }
                }
            }
        }
        return;
    },
    loadDBViewData: function(callback) {
        var pageName = DataHandler.getData("pageName", "");
        var resultPattern = DataHandler.getAppData("resultPattern.dbview");
        var tableName = this.getTableName(resultPattern);
        var dbDataApis = this._getScanDirDataApi(tableName);
        var keys = ["appControlDataLoadStatus", "metaDataLoadStatus"];
        var status = CommonDataHandler.getDataLoadStatusByKey(keys);
        var database;
        var dbTableDataIndex = null, self = this;
        var filterKeyMapping;
        if (status === "completed") {
            status = DataHandler.getData("dbViewDataLoadStatus");
            if (status === "not-started") {
                DataHandler.setData("dbViewDataLoadStatus", "in-progress");
                var dbViewData;
                CommonDataHandler.LoadDBViewData(dbDataApis, function(request) {
                    DataHandler.setData("dbViewDataLoadStatus", "completed");
                    CommonDataHandler.FormateApiResponseInRequest(request);
                    database = AppHandler.GenerateDatabaseV2(request, dbTableDataIndex);
                    self._updateFileDetails(database);
                    dbViewData = DataHandler.getData("dbViewData", {});
                    dbViewData = AppHandler.MergeDatabase(dbViewData, database);
                    DataHandler.setData("dbViewData", dbViewData);
                    dbViewData = DBViewDataHandler.GetFinalTable(dbViewData, resultPattern, null, [tableName]);
                    DataHandler.setData("dbViewDataTable", dbViewData);
                    DataHandlerV2.generateFilterOptions(pageName, dbViewData, filterKeyMapping);
                    $S.callMethod(callback);
                });
            } else {
                $S.callMethod(callback);
            }
        }
    },
    loadScanDirConfigDataApi: function(pageName, callback) {
        this.loadDBViewConfigData(callback);
    },
    loadScanDirDataApi: function(pageName, callback) {
        if (["scanDirPage"].indexOf(pageName) >= 0) {
            this.loadDBViewData(callback);
        } else {
            callback();
        }
    }
});
})($S);

export default ScanDir;
