import $S from "../../interface/stack.js";
import TemplateHandler from "../common/TemplateHandler";
// import Template from "../common/Template";

// import Config from "./Config";
import DataHandler from "../common/DataHandler";
import DataHandlerV2 from "../common/DataHandlerV2";
import FormHandler from "../forms/FormHandler";


import TemplateHelper from "../../common/TemplateHelper";
// import AppHandler from "../../common/app/common/AppHandler";
import CommonDataHandler from "../../common/app/common/CommonDataHandler";
// import CommonConfig from "../../common/app/common/CommonConfig";
import DBViewDataHandler from "../../common/app/common/DBViewDataHandler";
import DBViewTemplateHandler from "../../common/app/common/DBViewTemplateHandler";


var PidPage;
(function($S){
// var DT = $S.getDT();
// var loadingCount = 0;
PidPage = function(arg) {
    return new PidPage.fn.init(arg);
};
PidPage.fn = PidPage.prototype = {
    constructor: PidPage,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};

$S.extendObject(PidPage);

PidPage.extend({
    _updateAttr: function(pageName, pid, rowData) {
        if ($S.isObject(rowData)) {
            if (!$S.isStringV2(rowData["status"])) {
                rowData["status"] = "Pending";
            }
            if ($S.isStringV2(rowData["unique_id"])) {
                rowData["update_link"] = DataHandler.getLinkV3(pid, rowData["unique_id"]);
            }
        }
    },
    _getUpdateLink: function(rowData) {
        if (!$S.isArray(rowData)) {
            return null;
        }
        for (var i=0; i<rowData.length; i++) {
            if ($S.isObject(rowData[i]) && rowData[i]["name"] === "update_link") {
                return rowData[i]["value"];
            }
        }
        return null;
    },
    _updateAttrV2: function(pageName, pid, rowData, colData) {
        var updateLink = null;
        if ($S.isObject(colData)) {
            if (colData["name"] === "status") {
                updateLink = this._getUpdateLink(rowData);
                if ($S.isStringV2(updateLink)) {
                    colData["text"] = {
                        "tag": "div",
                        "text": [
                            {
                                "tag": "div.span",
                                "text": colData["value"]
                            },
                            {
                                "tag": "div",
                                "text": {
                                    "tag": "link",
                                    "href": updateLink,
                                    "text": "Update"
                                }
                            }
                        ]
                    };
                }
            }
        }
    },
    _updateFieldAttr: function(pageName, pid, data) {
        if (!$S.isArray(data)) {
            return data;
        }
        for (var i=0; i<data.length; i++) {
            if (!$S.isObject(data[i])) {
                continue;
            }
            this._updateAttr(pageName, pid, data[i]);
        }
        return data;
    },
    _updateFieldAttrV2: function(pageName, pid, data) {
        if (!$S.isArray(data)) {
            return data;
        }
        for (var i=0; i<data.length; i++) {
            if (!$S.isArray(data[i])) {
                continue;
            }
            for(var j=0; j<data[i].length; j++) {
                this._updateAttrV2(pageName, pid, data[i], data[i][j]);
            }
        }
        return data;
    },
    _getRenderTable: function(pageName, pid) {
        var tableName = DataHandler.getTableName("feedbackTable");
        var tableData = DataHandlerV2.getTableDataByAttr(tableName, "pid", pid);
        this._updateFieldAttr(pageName, pid, tableData);
        var resultPattern = DataHandler.getAppData(pageName + ".resultPattern");
        var resultCriteria = null, requiredDataTable = null, currentList3Data = null, dateParameterField = null, dateSelect = null;
        var finalTable = DBViewDataHandler.GetFinalTable({"feedback_table": {"tableData": tableData}}, resultPattern, resultCriteria, requiredDataTable);
        var renderData = DBViewDataHandler.GenerateFinalDBViewData(finalTable, currentList3Data, dateParameterField, dateSelect);
        var sortingFields = DataHandler.getData("sortingFields", []);
        renderData = DBViewDataHandler.SortDbViewResult(renderData, sortingFields, dateParameterField);
        var updateData = ($S.isArray(renderData) && renderData.length === 1) ? renderData[0].text : null;
        this._updateFieldAttrV2(pageName, pid, updateData);
        var renderFieldRow = DBViewTemplateHandler.GenerateDbViewRenderField(renderData, currentList3Data, sortingFields);
        return renderFieldRow;
    },
    getRenderField: function(pageName) {
        var template = TemplateHandler.getTemplate("home");
        var pid = CommonDataHandler.getPathParamsData("pid");
        var newFormField = FormHandler.getFormTemplate(pageName, "addFeedbackForm");
        var homeFields = this._getRenderTable(pageName, pid);
        if (homeFields.length === 0 && newFormField === null) {
            template = TemplateHandler.getTemplate("noDataFound");
        } else {
            TemplateHelper.addItemInTextArray(template, "home.link", homeFields);
            TemplateHelper.addItemInTextArray(template, "home.addNewProject", newFormField);
        }
        return template;
    }
});

})($S);

export default PidPage;
