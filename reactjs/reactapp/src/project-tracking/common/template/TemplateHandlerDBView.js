import $S from "../../../interface/stack.js";
// import Config from "../Config";
import DataHandler from "../DataHandler";
// import FormHandler from "../forms/FormHandler";

import TemplateHandler from "./TemplateHandler";

import TemplateHelper from "../../../common/TemplateHelper";
// import AppHandler from "../../../common/app/common/AppHandler";
import DBViewDataHandler from "../../../common/app/common/DBViewDataHandler";
import DBViewTemplateHandler from "../../../common/app/common/DBViewTemplateHandler";

var TemplateHandlerDBView;
(function($S){
// var DT = $S.getDT();
// var loadingCount = 0;
TemplateHandlerDBView = function(arg) {
    return new TemplateHandlerDBView.fn.init(arg);
};
TemplateHandlerDBView.fn = TemplateHandlerDBView.prototype = {
    constructor: TemplateHandlerDBView,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};

$S.extendObject(TemplateHandlerDBView);
TemplateHandlerDBView.extend({
    getDbViewFields: function(renderData) {
        var template = TemplateHandler.getTemplate("displaySupplyStatus");
        var currentList3Data = DataHandler.getCurrentList3Data();
        var sortingFields = DataHandler.getData("sortingFields", []);
        var resultPattern = DataHandler.getAppData("resultPatternSupplyStatusDisplay");
        var tableName = DataHandler.getTableName("materialSupplyStatus");
        var dateSelect = DataHandler.getData("date-select", "");
        var dateParameterField = DataHandler.getAppData("dateParameterField", {});
        var resultCriteria = null;
        var requiredDataTable = null;
        var dbViewData = {};
        dbViewData[tableName] = {"tableData": renderData};
        var finalTable = DBViewDataHandler.GetFinalTable(dbViewData, resultPattern, resultCriteria, requiredDataTable);
        renderData = DBViewDataHandler.GenerateFinalDBViewData(finalTable, currentList3Data, dateParameterField, dateSelect);
        DBViewDataHandler.SortDbViewResult(renderData, sortingFields, dateParameterField);
        var htmlFields = DBViewTemplateHandler.GenerateDbViewRenderField(renderData, currentList3Data, sortingFields);
        TemplateHelper.addItemInTextArray(template, "displaySupplyStatus.projectSupplyStatus.table", htmlFields);
        return template;
    }
});

})($S);

export default TemplateHandlerDBView;
