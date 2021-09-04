import $S from "../../../interface/stack.js";
import DataHandler from "../DataHandler";
import DataHandlerV2 from "../DataHandlerV2";
import TemplateHandler from "../template/TemplateHandler";
// import Config from "../Config";

import AppHandler from "../../../common/app/common/AppHandler";
import CommonDataHandler from "../../../common/app/common/CommonDataHandler";
import TemplateHelper from "../../../common/TemplateHelper";
// import FormHandler from "../forms/FormHandler";
import DBViewDataHandler from "../../../common/app/common/DBViewDataHandler";


var DisplayPage;
var _temp;
(function($S){
// var DT = $S.getDT();

DisplayPage = function(arg) {
    return new DisplayPage.fn.init(arg);
};
DisplayPage.fn = DisplayPage.prototype = {
    constructor: DisplayPage,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(DisplayPage);
DisplayPage.extend({
    _getFinalDbTable: function(finalTable, requiredDataTable) {
        var finalDbTable = [], temp;
        var requiredTableName = "";
        if ($S.isArray(requiredDataTable) && requiredDataTable.length > 0 && $S.isStringV2(requiredDataTable[0])) {
            requiredTableName = requiredDataTable[0];
        } else {
            return finalDbTable;
        }
        if ($S.isArray(finalTable)) {
            for (var i=0; i<finalTable.length; i++) {
                if (!$S.isObject(finalTable[i]) || !$S.isObject(finalTable[i][requiredTableName])) {
                    continue;
                }
                temp = finalTable[i][requiredTableName];
                if (Object.keys(temp).length > 0) {
                    finalDbTable.push(temp);
                }
            }
        }
        return finalDbTable;
    },
    getRenderData: function(pageName, pageId, sortingFields) {
        var requiredDataTable = DataHandler.getAppData("pageId:" + pageId + ".requiredDataTable");
        var filterKeyMapping = DataHandler.getAppData("pageId:" + pageId + ".filterKeyMapping");
        var resultPattern = DataHandler.getAppData("pageId:" + pageId + ".resultPattern");
        var resultCriteria = DataHandler.getAppData("pageId:" + pageId + ".resultCriteria");
        var currentAppData = DataHandler.getCurrentAppData();
        var metaData = CommonDataHandler.getData("metaData");
        var filterOptions = DataHandler.getData("filterOptions");
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
        finalTable = this._getFinalDbTable(finalTable, requiredDataTable);
        DataHandlerV2.generateFilterOptions(pageName, finalTable, filterKeyMapping);
        finalTable = AppHandler.getFilteredData(currentAppData, metaData, finalTable, filterOptions, "name");
        dbViewData = DataHandlerV2.handlePageByPageId(pageName, pageId, finalTable);
        finalTable = DBViewDataHandler.ApplyResultPattern(dbViewData, resultPattern);
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
    _generateResult: function(fileInfoDataRow, fileTableRow, loginUsername, index) {
        var result = null;
        var deleteFileTemplate = TemplateHandler.getTemplate("deleteFileTemplate");
        var temp;
        var buttonNameRemove = "remove_file.form.button";
        var deleteAllowed = false;
        if ($S.isObject(fileTableRow)) {
            temp = deleteFileTemplate;
            TemplateHelper.updateTemplateValue(temp, {"delete_file.form": fileTableRow.tableUniqueId});
            if (fileTableRow.updatedBy === loginUsername) {
                TemplateHelper.removeClassTemplate(temp, buttonNameRemove, "disabled");
                TemplateHelper.addClassTemplate(temp, buttonNameRemove, "text-danger");
            }
            if ($S.isObject(fileInfoDataRow) && fileInfoDataRow.fileUsername === loginUsername) {
                deleteAllowed = true;
            }
            result = {"tag": "tr", "deleteAllowed": deleteAllowed, "text": [
                {
                    "tag": "td.b",
                    "text": index
                },
                {
                    "tag": "td",
                    "text": fileTableRow.subject
                },
                {
                    "tag": "td.b",
                    "text": fileTableRow.updatedBy
                },
                {
                    "tag": "td",
                    "text": fileTableRow.pName
                },
                {
                    "tag": "td",
                    "text": temp
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
        filepath = fileInfoDataRow.filepath;
        var index = 1, i;
        for (i=0; i<finalTable.length; i++) {
            if (!$S.isObject(finalTable[i])) {
                continue;
            }
            if (filepath === finalTable[i].filename) {
                _temp = this._generateResult(fileInfoDataRow, finalTable[i], loginUsername, index);
                if (_temp === null) {
                    continue;
                }
                addedFilePid.push(finalTable[i].tableUniqueId);
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
    }
});
})($S);

export default DisplayPage;
