import $S from "../../../interface/stack.js";
import DataHandler from "../DataHandler";
import DataHandlerV2 from "../DataHandlerV2";
import TemplateHandler from "../template/TemplateHandler";
// import Config from "../Config";

// import AppHandler from "../../../common/app/common/AppHandler";
import TemplateHelper from "../../../common/TemplateHelper";
import FormHandler from "../forms/FormHandler";
import DBViewDataHandler from "../../../common/app/common/DBViewDataHandler";


var DisplayPage;

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
    getRenderData: function(pageName, sortingFields) {
        var pageId = DataHandler.getPathParamsData("pageId");
        var requiredDataTable = DataHandler.getAppData("pageId:" + pageId + ".requiredDataTable");
        var dbViewData = {}, i;
        if ($S.isArray(requiredDataTable)) {
            for (i=0; i<requiredDataTable.length; i++) {
                if ($S.isStringV2(requiredDataTable[i])) {
                    dbViewData[requiredDataTable[i]] = {"tableData": DataHandlerV2.getTableData(requiredDataTable[i])};
                }
            }
        }
        DataHandlerV2.handlePageByPageId(pageId, dbViewData);
        var resultPattern = DataHandler.getAppData("pageId:" + pageId + ".resultPattern");
        var resultCriteria = DataHandler.getAppData("pageId:" + pageId + ".resultCriteria");
        var finalTable = DBViewDataHandler.GetFinalTable(dbViewData, resultPattern, resultCriteria, null);
        DataHandlerV2.generateFilterOptions(finalTable);
        return finalTable;
    },
    getRenderDataV2: function(pageName, viewPageName, sortingFields) {
        var requiredDataTable = DataHandler.getAppData("viewPage:" + viewPageName + ".requiredDataTable");
        var fileInfoTableName = DataHandler.getTableName("pageName:pageView:fileInfoTable")
        var dbViewData = {}, i;
        if ($S.isArray(requiredDataTable)) {
            for (i=0; i<requiredDataTable.length; i++) {
                if ($S.isStringV2(requiredDataTable[i])) {
                    dbViewData[requiredDataTable[i]] = {"tableData": DataHandlerV2.getTableData(requiredDataTable[i])};
                }
            }
        }
        DataHandlerV2.handlePageByViewPageName(pageName, viewPageName, dbViewData);
        var resultPattern = DataHandler.getAppData("viewPage:" + viewPageName + ".resultPattern");
        var resultCriteria = DataHandler.getAppData("viewPage:" + viewPageName + ".resultCriteria");
        var finalTable = DBViewDataHandler.GetFinalTableV2(dbViewData, resultCriteria, [fileInfoTableName]);
        DataHandlerV2.handlePageByViewPageNameV2(pageName, viewPageName, finalTable);
        finalTable = DBViewDataHandler.ApplyResultPattern(finalTable, resultPattern);
        DataHandlerV2.generateFilterOptions(finalTable);
        return finalTable;
    },
    _generateResult: function(fileTable, loginUsername) {
        var result = {"tag": "table.tbody", "className": "table-striped table-padded-px-5", "text": []}, i;
        var deleteFileTemplate = TemplateHandler.getTemplate("deleteFileTemplate");
        var temp;
        function isDeleteEnable(fileTableEntry, loginUsername) {
            if ($S.isObject(fileTableEntry) && $S.isStringV2(loginUsername)) {
                return loginUsername === fileTableEntry.updatedBy;
            }
            return false;
        }
        var buttonName = "delete_file.form.button";
        if ($S.isArray(fileTable)) {
            for(i=0; i<fileTable.length; i++) {
                temp = $S.clone(deleteFileTemplate);
                TemplateHelper.updateTemplateValue(temp, {"delete_file.form": fileTable[i].unique_id});
                if (isDeleteEnable(fileTable[i], loginUsername)) {
                    TemplateHelper.removeClassTemplate(temp, buttonName, "disabled");
                    TemplateHelper.addClassTemplate(temp, buttonName, "text-danger");
                }
                result.text.push({"tag": "tr", "text": [
                    {
                        "tag": "td.b",
                        "text": (i+1)
                    },
                    {
                        "tag": "td",
                        "text": fileTable[i].subject
                    },
                    {
                        "tag": "td.b",
                        "text": fileTable[i].updatedBy
                    },
                    {
                        "tag": "td",
                        "text": fileTable[i].pName
                    },
                    {
                        "tag": "td",
                        "text": temp
                    }
                ]});
            }
        }
        return result;
    },
    getFileAvailableProjects: function(fileInfoData, loginUsername) {
        if (!$S.isObject(fileInfoData)) {
            fileInfoData = {};
        }
        var fileInfoTableName = DataHandler.getTableName("pageName:pageView:fileInfoTable");
        var relatedProjectsFiles;
        if ($S.isObject(fileInfoData[fileInfoTableName]) && $S.isArray(fileInfoData[fileInfoTableName]["relatedProjectsFiles"])) {
            relatedProjectsFiles = fileInfoData[fileInfoTableName]["relatedProjectsFiles"];
        }
        return this._generateResult(relatedProjectsFiles, loginUsername);
    },
    getAddProjectForm: function(fileInfoData) {
        var projectTable = DataHandlerV2.getTableData(DataHandler.getTableName("projectTable"))
        return FormHandler.getAddProjectFilesTemplate(null, fileInfoData, projectTable);
    }
});
})($S);

export default DisplayPage;
