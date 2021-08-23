import $S from "../../interface/stack.js";
import TemplateHandler from "../common/TemplateHandler";
// import Template from "../common/Template";

// import Config from "./Config";
import DataHandler from "../common/DataHandler";
import DataHandlerV2 from "../common/DataHandlerV2";
import FormHandler from "../forms/FormHandler";


import TemplateHelper from "../../common/TemplateHelper";
import CommonDataHandler from "../../common/app/common/CommonDataHandler";
import DBViewDataHandler from "../../common/app/common/DBViewDataHandler";
import DBViewTemplateHandler from "../../common/app/common/DBViewTemplateHandler";


var Id1Page;
(function($S){
// var DT = $S.getDT();
// var loadingCount = 0;
Id1Page = function(arg) {
    return new Id1Page.fn.init(arg);
};
Id1Page.fn = Id1Page.prototype = {
    constructor: Id1Page,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};

$S.extendObject(Id1Page);
Id1Page.extend({
    _getFeedbackFields: function(feedbackData) {
        if (!$S.isObject(feedbackData)) {
            return null;
        }
        var template = DataHandler.getAppData("feedbackDetails.resultPattern");
        TemplateHelper.updateTemplateText(template, feedbackData);
        return template;
    },
    _getTableHtml: function(tableData) {
        var resultPattern = DataHandler.getAppData("commentTemplate.resultPattern");
        var sortingFields = DataHandler.getData("sortingFields", []);
        var resultCriteria = null, requiredDataTable = null, currentList3Data = null, dateParameterField = null, dateSelect = null;
        var finalTable = DBViewDataHandler.GetFinalTable({"comment_table": {"tableData": tableData}}, resultPattern, resultCriteria, requiredDataTable);
        var renderData = DBViewDataHandler.GenerateFinalDBViewData(finalTable, currentList3Data, dateParameterField, dateSelect);
        renderData = DBViewDataHandler.SortDbViewResult(renderData, sortingFields, dateParameterField);
        var renderFieldRow = DBViewTemplateHandler.GenerateDbViewRenderField(renderData, currentList3Data, sortingFields);
        return renderFieldRow;
    },
    _getProjectTable: function(pageName, pid, id1) {
        var tableName = DataHandler.getTableName("feedbackComment");
        var attr = {"pid": pid, "id1": id1};
        var tableData = DataHandlerV2.getTableDataByAttrV2(tableName, attr);
        var comments = this._getTableHtml(tableData);
        return comments;
    },
    _getFeedbackDetails: function(pageName, pid, id1) {
        var attr = {"pid": pid, "unique_id": id1};
        var tableData = DataHandlerV2.getFeedbackTableDataByAttr(attr);
        if ($S.isArray(tableData) && tableData.length === 1) {
            DataHandlerV2.updateFeedbackStatus(tableData);
            return this._getFeedbackFields(tableData[0], pid, id1);
        }
        return null;
    },
    getRenderField: function(pageName) {
        var pid = CommonDataHandler.getPathParamsData("pid", "");
        var id1 = CommonDataHandler.getPathParamsData("id1", "");
        var template = TemplateHandler.getTemplate("id1Page");
        var tableField = this._getProjectTable(pageName, pid, id1);
        var feedbackDetails = this._getFeedbackDetails(pageName, pid, id1);
        var currentStatus = DataHandlerV2.getFeedbackCurrentStatus(pid, id1);
        var finalStatusRef = DataHandler.getAppData(pageName + ".finalStatusRef", "");
        var isUpdateFeedbackEnable = DataHandlerV2.isEnabled("form", "updateFeedbackForm.force");
        var newFormField = null;
        if (currentStatus !== finalStatusRef || isUpdateFeedbackEnable) {
            newFormField = FormHandler.getFormTemplate(pageName, "updateFeedbackForm");
        }
        if (tableField.length === 0 && newFormField === null && feedbackDetails === null) {
            template = TemplateHandler.getTemplate("noDataFound");
        } else {
            TemplateHelper.addItemInTextArray(template, "id1Page.details", feedbackDetails);
            TemplateHelper.addItemInTextArray(template, "id1Page.comments", tableField);
            TemplateHelper.addItemInTextArray(template, "id1Page.updateFeedback", newFormField);
        }
        return template;
    }
});

})($S);

export default Id1Page;
