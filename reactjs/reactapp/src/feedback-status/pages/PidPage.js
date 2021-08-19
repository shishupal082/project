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
    _getRenderTable: function(pageName, pid) {
        var tableName = DataHandler.getTableName("feedbackTable");
        var tableData = DataHandlerV2.getTableDataByAttr(tableName, "pid", pid);
        var resultPattern = DataHandler.getAppData(pageName + ".resultPattern");
        var resultCriteria = null, requiredDataTable = null, currentList3Data = null, dateParameterField = null, dateSelect = null;
        var finalTable = DBViewDataHandler.GetFinalTable({"feedback_table": {"tableData": tableData}}, resultPattern, resultCriteria, requiredDataTable);
        var renderData = DBViewDataHandler.GenerateFinalDBViewData(finalTable, currentList3Data, dateParameterField, dateSelect);

        var sortingFields = DataHandler.getData("sortingFields", []);
        renderData = DBViewDataHandler.SortDbViewResult(renderData, sortingFields, dateParameterField);
        var renderFieldRow = DBViewTemplateHandler.GenerateDbViewRenderField(renderData, currentList3Data, sortingFields);

        return renderFieldRow;
    },
    getRenderField: function(pageName) {
        var template = TemplateHandler.getTemplate("home");
        var pid = CommonDataHandler.getPathParamsData("pid");
        var newFormField = FormHandler.getFeedbackFormTemplate();
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
