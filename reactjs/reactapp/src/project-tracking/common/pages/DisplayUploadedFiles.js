import $S from "../../../interface/stack.js";
import DataHandler from "../DataHandler";
import DataHandlerV2 from "../DataHandlerV2";
import TemplateHandler from "../template/TemplateHandler";
import Config from "../Config";

import AppHandler from "../../../common/app/common/AppHandler";
import TemplateHelper from "../../../common/TemplateHelper";
// import FormHandler from "./FormHandler";
import DBViewDataHandler from "../../../common/app/common/DBViewDataHandler";


var DisplayUploadedFiles;

(function($S){
// var DT = $S.getDT();

DisplayUploadedFiles = function(arg) {
    return new DisplayUploadedFiles.fn.init(arg);
};
DisplayUploadedFiles.fn = DisplayUploadedFiles.prototype = {
    constructor: DisplayUploadedFiles,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(DisplayUploadedFiles);
DisplayUploadedFiles.extend({
    getFileDisplayTemplate: function(pageName, data, loginUsername) {
        if (!$S.isObject(data)) {
            data = {};
        }
        var fileTemplate = TemplateHandler.getTemplate("file_details");
        var fileName = data.filename;
        var fileUsername = "";
        var filePath = data.filename, temp, key;
        var isValidFileData = false;
        if ($S.isStringV2(filePath)) {
            temp = filePath.split("/");
            if (temp.length === 2) {
                isValidFileData = true;
                fileUsername = temp[0];
                fileName = temp[1];
            }
        }
        var buttonName = "delete_file.form.button";
        if (loginUsername === fileUsername && pageName === Config.projectId) {
            TemplateHelper.removeClassTemplate(fileTemplate, buttonName, "disabled");
            TemplateHelper.addClassTemplate(fileTemplate, buttonName, "text-danger");
        }
        var textReplaceParam = {"fileName": fileName};
        var valueReplaceParam = {"view_file.unique_id": data.unique_id, "delete_file.form": data.unique_id};
        var hrefReplaceParam = {};
        hrefReplaceParam["open_in_new_tab.href"] = Config.baseApi + "/view/file/" + filePath + "?u=" + loginUsername;
        hrefReplaceParam["download.href"] = Config.baseApi + "/download/file/" + filePath + "?u=" + loginUsername;
        TemplateHelper.updateTemplateText(fileTemplate, textReplaceParam);
        if (isValidFileData) {
            TemplateHelper.updateTemplateValue(fileTemplate, valueReplaceParam);
            for(key in hrefReplaceParam) {
                TemplateHelper.setTemplateAttr(fileTemplate, key, "href", hrefReplaceParam[key]);
            }
        } else {
            TemplateHelper.addClassTemplate(fileTemplate, "file-action-field", "d-none");
        }
        return fileTemplate;
    },
    getRenderData: function(pageName, sortingFields) {
        var requiredDataTable = DataHandler.getAppData(pageName + ".requiredDataTable");
        var fileTableName = DataHandler.getTableName("fileTable");
        var loginUsername = AppHandler.GetUserData("username", "");
        var dbViewData = {}, i;
        if ($S.isArray(requiredDataTable)) {
            for (i=0; i<requiredDataTable.length; i++) {
                if ($S.isStringV2(requiredDataTable[i])) {
                    dbViewData[requiredDataTable[i]] = {"tableData": DataHandlerV2.getTableData(requiredDataTable[i])};
                }
            }
        }
        var tableData;
        if ($S.isObject(dbViewData[fileTableName]) && $S.isArray(dbViewData[fileTableName]["tableData"])) {
            tableData = dbViewData[fileTableName]["tableData"];
            for(i=0; i<tableData.length; i++) {
                if (!$S.isObject(tableData[i])) {
                    continue;
                }
                tableData[i]["fileLinks"] = this.getFileDisplayTemplate(pageName, tableData[i], loginUsername);//this.getDisplayName(projectTableName, "pid", tableData[i]["pid"], "pName");
            }
        }
        var resultPattern = DataHandler.getAppData(pageName + ".resultPattern");
        var resultCriteria = DataHandler.getAppData(pageName + ".resultCriteria");
        var finalTable = DBViewDataHandler.GetFinalTable(dbViewData, resultPattern, resultCriteria, null);
        DataHandlerV2.generateFilterOptions(finalTable);
        return finalTable;
    }
});
})($S);

export default DisplayUploadedFiles;
